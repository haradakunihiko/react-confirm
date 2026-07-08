"use strict";
// Lightweight registry to control pending confirmations from outside
// Stores only control handles (resolve/reject/dispose), not UI state
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.unregister = unregister;
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
    var cleanup = function () {
        var h = active.get(promise);
        if (h)
            h.settled = true;
        active.delete(promise);
    };
    promise
        .then(cleanup, cleanup)
        .catch(function () {
        // Already handled by cleanup
    });
}
function unregister(promise) {
    active.delete(promise);
}
/**
 * Resolve a confirmation dialog and close it
 * @param promise The Promise to resolve
 * @param response The response value to resolve with
 * @returns true if successful
 */
function proceed(promise, response) {
    var _a;
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        (_a = handle.setShow) === null || _a === void 0 ? void 0 : _a.call(handle, false);
        handle.resolve(response);
    }
    finally {
        try {
            handle.dispose();
        }
        catch (_b) {
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
    var _a;
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        (_a = handle.setShow) === null || _a === void 0 ? void 0 : _a.call(handle, false);
        handle.dispose();
    }
    catch (_b) {
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
    var _a;
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        (_a = handle.setShow) === null || _a === void 0 ? void 0 : _a.call(handle, false);
        handle.reject(reason);
    }
    finally {
        try {
            handle.dispose();
        }
        catch (_b) {
            // Ignore
        }
        active.delete(promise);
    }
    return true;
}
