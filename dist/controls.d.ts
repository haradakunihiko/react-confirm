/**
 * Custom error thrown when a confirmation is cancelled
 */
export declare class AbortError extends Error {
    constructor(message?: string);
}
/**
 * Control handle for a confirmation dialog
 */
export type ConfirmationHandle = {
    reject: (reason?: Error) => void;
    dispose: () => void;
    settled?: boolean;
};
/**
 * Register a Promise and its handle to the registry
 */
export declare function register(promise: Promise<unknown>, handle: ConfirmationHandle): void;
/**
 * Cancel an individual Promise
 * @param promise The Promise to cancel
 * @param reason The cancellation reason (defaults to AbortError)
 * @returns true if cancellation was successful
 */
export declare function abort(promise: Promise<unknown>, reason?: Error): boolean;
/**
 * Cancel all pending Promises
 * @param reason The cancellation reason (defaults to AbortError)
 * @returns The number of cancelled Promises
 */
export declare function abortAll(reason?: Error): number;
/**
 * Attach an AbortSignal to a Promise
 * @param signal The AbortSignal
 * @param promise The Promise to attach to
 * @returns A function to detach the signal
 */
export declare function attachAbortSignal(signal: AbortSignal, promise: Promise<unknown>): () => void;
