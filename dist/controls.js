"use strict";
// Lightweight registry to control pending confirmations from outside
// Stores only control handles (reject/dispose), not UI state
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortError = void 0;
exports.register = register;
exports.abort = abort;
exports.abortAll = abortAll;
exports.attachAbortSignal = attachAbortSignal;
/**
 * Custom error thrown when a confirmation is cancelled
 */
var AbortError = /** @class */ (function (_super) {
    __extends(AbortError, _super);
    function AbortError(message) {
        if (message === void 0) { message = 'Aborted'; }
        var _this = _super.call(this, message) || this;
        _this.name = 'AbortError';
        return _this;
    }
    return AbortError;
}(Error));
exports.AbortError = AbortError;
var active = new Map();
/**
 * Create an AbortError (or use provided reason if available)
 */
function createAbortError(reason) {
    if (reason !== undefined)
        return reason;
    // Use DOMException if available (standard AbortError)
    if (typeof DOMException !== 'undefined') {
        try {
            return new DOMException('Aborted', 'AbortError');
        }
        catch (_a) {
            // Fallback
        }
    }
    return new AbortError();
}
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
 * Cancel an individual Promise
 * @param promise The Promise to cancel
 * @param reason The cancellation reason (defaults to AbortError)
 * @returns true if cancellation was successful
 */
function abort(promise, reason) {
    var handle = active.get(promise);
    if (!handle || handle.settled)
        return false;
    try {
        handle.reject(createAbortError(reason));
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
 * Cancel all pending Promises
 * @param reason The cancellation reason (defaults to AbortError)
 * @returns The number of cancelled Promises
 */
function abortAll(reason) {
    var items = Array.from(active.entries());
    var count = 0;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var _a = items_1[_i], p = _a[0], h = _a[1];
        if (h.settled) {
            active.delete(p);
            continue;
        }
        try {
            h.reject(createAbortError(reason));
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
 * @returns A function to detach the signal
 */
function attachAbortSignal(signal, promise) {
    var onAbort = function () {
        abort(promise, signal.reason);
    };
    // Execute immediately if already aborted
    if (signal.aborted) {
        onAbort();
        return function () { };
    }
    signal.addEventListener('abort', onAbort, { once: true });
    return function () { return signal.removeEventListener('abort', onAbort); };
}
