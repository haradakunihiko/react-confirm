// Lightweight registry to control pending confirmations from outside
// Stores only control handles (reject/dispose), not UI state

/**
 * Custom error thrown when a confirmation is cancelled
 */
export class AbortError extends Error {
  constructor(message: string = 'Aborted') {
    super(message);
    this.name = 'AbortError';
  }
}

/**
 * Control handle for a confirmation dialog
 */
export type ConfirmationHandle = {
  reject: (reason?: Error) => void;
  dispose: () => void;
  settled?: boolean;
};

const active = new Map<Promise<unknown>, ConfirmationHandle>();

/**
 * Create an AbortError (or use provided reason if available)
 */
function createAbortError(reason?: Error): Error {
  if (reason !== undefined) return reason;

  // Use DOMException if available (standard AbortError)
  if (typeof DOMException !== 'undefined') {
    try {
      return new DOMException('Aborted', 'AbortError');
    } catch {
      // Fallback
    }
  }

  return new AbortError();
}

/**
 * Register a Promise and its handle to the registry
 */
export function register(promise: Promise<unknown>, handle: ConfirmationHandle): void {
  active.set(promise, handle);

  // Auto cleanup after settlement
  promise
    .finally(() => {
      const h = active.get(promise);
      if (h) h.settled = true;
      active.delete(promise);
    })
    .catch(() => {
      // Already handled by finally
    });
}

/**
 * Cancel an individual Promise
 * @param promise The Promise to cancel
 * @param reason The cancellation reason (defaults to AbortError)
 * @returns true if cancellation was successful
 */
export function abort(promise: Promise<unknown>, reason?: Error): boolean {
  const handle = active.get(promise);
  if (!handle || handle.settled) return false;

  try {
    handle.reject(createAbortError(reason));
  } finally {
    try {
      handle.dispose();
    } catch {
      // Ignore
    }
    active.delete(promise);
  }

  return true;
}

/**
 * Cancel all pending Promises
 * @param reason The cancellation reason (defaults to AbortError)
 * @returns The number of cancelled Promises
 */
export function abortAll(reason?: Error): number {
  const items = Array.from(active.entries());
  let count = 0;

  for (const [p, h] of items) {
    if (h.settled) {
      active.delete(p);
      continue;
    }

    try {
      h.reject(createAbortError(reason));
    } finally {
      try {
        h.dispose();
      } catch {
        // Ignore
      }
      active.delete(p);
      count++;
    }
  }

  return count;
}

/**
 * Attach an AbortSignal to a Promise
 * @param signal The AbortSignal
 * @param promise The Promise to attach to
 * @returns A function to detach the signal
 */
export function attachAbortSignal(signal: AbortSignal, promise: Promise<unknown>): () => void {
  const onAbort = () => {
    abort(promise, signal.reason);
  };

  // Execute immediately if already aborted
  if (signal.aborted) {
    onAbort();
    return () => {};
  }

  signal.addEventListener('abort', onAbort, { once: true });
  return () => signal.removeEventListener('abort', onAbort);
}
