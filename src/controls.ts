// Lightweight registry to control pending confirmations from outside
// Stores only control handles (resolve/dispose), not UI state

/**
 * Control handle for a confirmation dialog
 */
export type ConfirmationHandle<R> = {
  resolve: (value: R) => void;
  reject: (reason?: any) => void;
  dispose: () => void;
  settled?: boolean;
};

const active = new Map<Promise<unknown>, ConfirmationHandle<unknown>>();

/**
 * Register a Promise and its handle to the registry
 */
export function register<R>(
  promise: Promise<R>,
  handle: ConfirmationHandle<R>
): void {
  active.set(promise, handle as ConfirmationHandle<unknown>);

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
 * Close an individual confirmation with a response
 * @param promise The Promise to close
 * @param response The response value to resolve with
 * @returns true if close was successful
 */
export function close<R>(promise: Promise<R>, response: R): boolean {
  const handle = active.get(promise) as ConfirmationHandle<R> | undefined;
  if (!handle || handle.settled) return false;

  try {
    handle.resolve(response);
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
 * Close all pending confirmations with a response
 * @param response The response value to resolve all with
 * @returns The number of closed confirmations
 */
export function closeAll<R>(response: R): number {
  const items = Array.from(active.entries());
  let count = 0;

  for (const [p, h] of items) {
    if (h.settled) {
      active.delete(p);
      continue;
    }

    try {
      (h as ConfirmationHandle<R>).resolve(response);
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
 * @param response Optional response value when signal is aborted. If not provided, promise will be rejected.
 * @returns A function to detach the signal
 */
export function attachAbortSignal<R>(
  signal: AbortSignal,
  promise: Promise<R>,
  response?: R
): () => void {
  const handle = active.get(promise) as ConfirmationHandle<R> | undefined;
  if (!handle || handle.settled) return () => {};

  const onAbort = () => {
    if (handle.settled) return;

    try {
      if (response !== undefined) {
        // Resolve with response value
        handle.resolve(response);
      } else {
        // Reject with AbortSignal's reason
        const reason = signal.reason ?? new Error('Aborted');
        handle.reject(reason);
      }
    } finally {
      try {
        handle.dispose();
      } catch {
        // Ignore
      }
      active.delete(promise);
    }
  };

  // Execute immediately if already aborted
  if (signal.aborted) {
    onAbort();
    return () => {};
  }

  signal.addEventListener('abort', onAbort, { once: true });
  return () => signal.removeEventListener('abort', onAbort);
}
