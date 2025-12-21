// Lightweight registry to control pending confirmations from outside
// Stores only control handles (resolve/reject/dispose), not UI state

/**
 * Control handle for a confirmation dialog
 */
export type ConfirmationHandle<R> = {
  resolve: (value: R) => void;
  reject: (reason?: any) => void;
  dispose: () => void;
  setShow?: (show: boolean) => void;
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
 * Resolve a confirmation dialog and close it
 * @param promise The Promise to resolve
 * @param response The response value to resolve with
 * @returns true if successful
 */
export function proceed<R>(promise: Promise<R>, response: R): boolean {
  const handle = active.get(promise) as ConfirmationHandle<R> | undefined;
  if (!handle || handle.settled) return false;

  try {
    handle.setShow?.(false);
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
 * Close a confirmation dialog without resolving or rejecting the Promise
 * The Promise remains pending
 * @param promise The Promise to dismiss
 * @returns true if successful
 */
export function dismiss<R>(promise: Promise<R>): boolean {
  const handle = active.get(promise) as ConfirmationHandle<R> | undefined;
  if (!handle || handle.settled) return false;

  try {
    handle.setShow?.(false);
    handle.dispose();
  } catch {
    // Ignore
  }
  active.delete(promise);

  return true;
}

/**
 * Reject a confirmation dialog and close it
 * @param promise The Promise to reject
 * @param reason The rejection reason
 * @returns true if successful
 */
export function cancel<R>(promise: Promise<R>, reason?: unknown): boolean {
  const handle = active.get(promise) as ConfirmationHandle<R> | undefined;
  if (!handle || handle.settled) return false;

  try {
    handle.setShow?.(false);
    handle.reject(reason);
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
