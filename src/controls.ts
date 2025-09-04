// Lightweight registry to control pending confirmations
// Keeps only control handles (reject/dispose), not UI state

export type ConfirmationHandle = {
  reject: (reason?: any) => void;
  dispose: () => void;
  settled?: boolean;
};

const active = new Map<Promise<unknown>, ConfirmationHandle>();

function createAbortError(reason?: any): any {
  if (reason !== undefined) return reason;
  try {
    // Prefer DOMException if available (AbortError)
    // eslint-disable-next-line no-new
    return new (globalThis as any).DOMException('Aborted', 'AbortError');
  } catch (_) {
    const err = new Error('Aborted');
    (err as any).name = 'AbortError';
    return err;
  }
}

export function register(promise: Promise<unknown>, handle: ConfirmationHandle): void {
  active.set(promise, handle);
  // Ensure cleanup after settlement
  promise.finally(() => {
    const h = active.get(promise);
    if (h) h.settled = true;
    active.delete(promise);
  }).catch(() => { /* noop: handled by finally */ });
}

export function abort(promise: Promise<unknown>, reason?: any): boolean {
  const handle = active.get(promise);
  if (!handle || handle.settled) return false;
  try {
    handle.reject(createAbortError(reason));
  } finally {
    try { handle.dispose(); } catch (_) { /* ignore */ }
    active.delete(promise);
  }
  return true;
}

export function abortAll(reason?: any): number {
  const items = Array.from(active.entries());
  let count = 0;
  for (const [p, h] of items) {
    if (h.settled) { active.delete(p); continue; }
    try {
      h.reject(createAbortError(reason));
    } finally {
      try { h.dispose(); } catch (_) { /* ignore */ }
      active.delete(p);
      count++;
    }
  }
  return count;
}

export function attachAbortSignal(signal: AbortSignal, promise: Promise<unknown>): () => void {
  const onAbort = () => { abort(promise, (signal as any).reason); };
  if ((signal as any).aborted) {
    // Fire synchronously if already aborted
    onAbort();
    return () => {};
  }
  signal.addEventListener('abort', onAbort, { once: true } as any);
  return () => signal.removeEventListener('abort', onAbort);
}

