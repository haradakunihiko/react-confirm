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
 * @param response Optional response value when signal is aborted. If not provided, promise will be rejected.
 * @returns A function to detach the signal
 */
function attachAbortSignal(signal, promise, response) {
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return function () { };
    var onAbort = function () {
        var _a;
        if (handle.settled)
            return;
        try {
            if (response !== undefined) {
                // Resolve with response value
                handle.resolve(response);
            }
            else {
                // Reject with AbortSignal's reason
                var reason = (_a = signal.reason) !== null && _a !== void 0 ? _a : new Error('Aborted');
                handle.reject(reason);
            }
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
    };
    // Execute immediately if already aborted
    if (signal.aborted) {
        onAbort();
        return function () { };
    }
    signal.addEventListener('abort', onAbort, { once: true });
    return function () { return signal.removeEventListener('abort', onAbort); };
}
