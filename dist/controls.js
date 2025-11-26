"use strict";
// Lightweight registry to control pending confirmations from outside
// Stores only control handles (resolve/reject/dispose), not UI state
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.proceed = proceed;
exports.dismiss = dismiss;
exports.cancel = cancel;
var active = new Map();
/**
 * Register a Promise and its handle to the registry
 */
function register(promise, handle) {
    active.set(promise, handle);
    // Auto cleanup after settlement
    promise
        .finally(function () {
        var h = active.get(promise);
        if (h)
            h.settled = true;
        active.delete(promise);
    })
        .catch(function () {
        // Already handled by finally
    });
}
/**
 * Resolve a confirmation dialog and close it
 * @param promise The Promise to resolve
 * @param response The response value to resolve with
 * @returns true if successful
 */
function proceed(promise, response) {
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        handle.resolve(response);
    }
    finally {
        try {
            handle.dispose();
        }
        catch (_a) {
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
function dismiss(promise) {
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        handle.dispose();
    }
    catch (_a) {
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
function cancel(promise, reason) {
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        handle.reject(reason);
    }
    finally {
        try {
            handle.dispose();
        }
        catch (_a) {
            // Ignore
        }
        active.delete(promise);
    }
    return true;
}
