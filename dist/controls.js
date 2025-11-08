"use strict";
// Lightweight registry to control pending confirmations from outside
// Stores only control handles (resolve/dispose), not UI state
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.close = close;
exports.closeAll = closeAll;
exports.attachAbortSignal = attachAbortSignal;
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
 * Close an individual confirmation with a response
 * @param promise The Promise to close
 * @param response The response value to resolve with
 * @returns true if close was successful
 */
function close(promise, response) {
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
 * Close all pending confirmations with a response
 * @param response The response value to resolve all with
 * @returns The number of closed confirmations
 */
function closeAll(response) {
    var items = Array.from(active.entries());
    var count = 0;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var _a = items_1[_i], p = _a[0], h = _a[1];
        if (h.settled) {
            active.delete(p);
            continue;
        }
        try {
            h.resolve(response);
        }
        finally {
            try {
                h.dispose();
            }
            catch (_b) {
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
 * @param response The response value when signal is aborted
 * @returns A function to detach the signal
 */
function attachAbortSignal(signal, promise, response) {
    var onAbort = function () {
        close(promise, response);
    };
    // Execute immediately if already aborted
    if (signal.aborted) {
        onAbort();
        return function () { };
    }
    signal.addEventListener('abort', onAbort, { once: true });
    return function () { return signal.removeEventListener('abort', onAbort); };
}
