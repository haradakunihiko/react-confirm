/**
 * Control handle for a confirmation dialog
 */
export type ConfirmationHandle<R> = {
    resolve: (value: R) => void;
    reject: (reason?: any) => void;
    dispose: () => void;
    settled?: boolean;
};
/**
 * Register a Promise and its handle to the registry
 */
export declare function register<R>(promise: Promise<R>, handle: ConfirmationHandle<R>): void;
/**
 * Resolve a confirmation dialog and close it
 * @param promise The Promise to resolve
 * @param response The response value to resolve with
 * @returns true if successful
 */
export declare function proceed<R>(promise: Promise<R>, response: R): boolean;
/**
 * Close a confirmation dialog without resolving or rejecting the Promise
 * The Promise remains pending
 * @param promise The Promise to dismiss
 * @returns true if successful
 */
export declare function dismiss<R>(promise: Promise<R>): boolean;
/**
 * Reject a confirmation dialog and close it
 * @param promise The Promise to reject
 * @param reason The rejection reason
 * @returns true if successful
 */
export declare function cancel<R>(promise: Promise<R>, reason?: unknown): boolean;
