/**
 * Control handle for a confirmation dialog
 */
export type ConfirmationHandle<R> = {
    resolve: (value: R) => void;
    dispose: () => void;
    settled?: boolean;
};
/**
 * Register a Promise and its handle to the registry
 */
export declare function register<R>(promise: Promise<R>, handle: ConfirmationHandle<R>): void;
/**
 * Close an individual confirmation with a response
 * @param promise The Promise to close
 * @param response The response value to resolve with
 * @returns true if close was successful
 */
export declare function close<R>(promise: Promise<R>, response: R): boolean;
/**
 * Close all pending confirmations with a response
 * @param response The response value to resolve all with
 * @returns The number of closed confirmations
 */
export declare function closeAll<R>(response: R): number;
/**
 * Attach an AbortSignal to a Promise
 * @param signal The AbortSignal
 * @param promise The Promise to attach to
 * @param response The response value when signal is aborted
 * @returns A function to detach the signal
 */
export declare function attachAbortSignal<R>(signal: AbortSignal, promise: Promise<R>, response: R): () => void;
