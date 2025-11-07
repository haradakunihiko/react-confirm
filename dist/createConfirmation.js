"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfirmationCreater = void 0;
var domTree_1 = require("./mounter/domTree");
var controls_1 = require("./controls");
var createConfirmationCreater = function (mounter) {
    return function (Component, unmountDelay, mountingNode) {
        if (unmountDelay === void 0) { unmountDelay = 1000; }
        return function (props, options) {
            var mountId;
            var rejectRef = function () { };
            function dispose() {
                setTimeout(function () {
                    mounter.unmount(mountId);
                }, unmountDelay);
            }
            var inner = new Promise(function (resolve, reject) {
                rejectRef = reject;
                try {
                    mountId = mounter.mount(Component, __assign({ reject: reject, resolve: resolve, dispose: dispose }, props), mountingNode);
                }
                catch (e) {
                    // keep behavior identical to JS version
                    console.error(e);
                    throw e;
                }
            });
            var wrapped = inner.then(function (result) {
                dispose();
                return result;
            }, function (err) {
                dispose();
                return Promise.reject(err);
            });
            // 外部からのキャンセルのためにレジストリに登録
            (0, controls_1.register)(wrapped, { reject: rejectRef, dispose: dispose });
            // AbortSignalが提供されていれば紐付ける
            if (options === null || options === void 0 ? void 0 : options.signal) {
                var detach = (0, controls_1.attachAbortSignal)(options.signal, wrapped);
                wrapped.finally(detach).catch(function () { });
            }
            return wrapped;
        };
    };
};
exports.createConfirmationCreater = createConfirmationCreater;
var defaultCreateConfirmation = (0, exports.createConfirmationCreater)((0, domTree_1.createDomTreeMounter)());
exports.default = defaultCreateConfirmation;
