"use strict";
// 未解決の確認ダイアログを外部から制御するための軽量なレジストリ
// UIの状態ではなく、制御用のハンドル（reject/dispose）のみを保持
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
 * 確認ダイアログをキャンセルする際にスローされるカスタムエラー
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
 * AbortErrorを作成する（reasonが提供されていない場合）
 */
function createAbortError(reason) {
    if (reason !== undefined)
        return reason;
    // DOMExceptionが利用可能であれば使用（標準的なAbortError）
    if (typeof DOMException !== 'undefined') {
        try {
            return new DOMException('Aborted', 'AbortError');
        }
        catch (_a) {
            // フォールバック
        }
    }
    return new AbortError();
}
/**
 * Promiseとそのハンドルをレジストリに登録
 */
function register(promise, handle) {
    active.set(promise, handle);
    // settled後は自動的にクリーンアップ
    promise
        .finally(function () {
        var h = active.get(promise);
        if (h)
            h.settled = true;
        active.delete(promise);
    })
        .catch(function () {
        // finallyで処理済みなので無視
    });
}
/**
 * 個別のPromiseをキャンセル
 * @param promise キャンセルするPromise
 * @param reason キャンセル理由（省略時はAbortErrorが使用される）
 * @returns キャンセルに成功した場合はtrue
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
            // 無視
        }
        active.delete(promise);
    }
    return true;
}
/**
 * 全ての未解決Promiseをキャンセル
 * @param reason キャンセル理由（省略時はAbortErrorが使用される）
 * @returns キャンセルされたPromiseの数
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
                // 無視
            }
            active.delete(p);
            count++;
        }
    }
    return count;
}
/**
 * AbortSignalをPromiseに紐付ける
 * @param signal AbortSignal
 * @param promise 紐付けるPromise
 * @returns デタッチ用の関数
 */
function attachAbortSignal(signal, promise) {
    var onAbort = function () {
        abort(promise, signal.reason);
    };
    // 既にabortedの場合は即座に実行
    if (signal.aborted) {
        onAbort();
        return function () { };
    }
    signal.addEventListener('abort', onAbort, { once: true });
    return function () { return signal.removeEventListener('abort', onAbort); };
}
