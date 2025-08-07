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
var createConfirmationCreater = function (mounter) { return function (Component, unmountDelay, mountingNode) {
    if (unmountDelay === void 0) { unmountDelay = 1000; }
    return function (props) {
        var mountId;
        var promise = new Promise(function (resolve, reject) {
            try {
                mountId = mounter.mount(Component, __assign({ reject: reject, resolve: resolve, dispose: dispose }, props), mountingNode);
            }
            catch (e) {
                console.error(e);
                throw e;
            }
        });
        function dispose() {
            setTimeout(function () {
                mounter.unmount(mountId);
            }, unmountDelay);
        }
        return promise.then(function (result) {
            dispose();
            return result;
        }, function (result) {
            dispose();
            return Promise.reject(result);
        });
    };
}; };
exports.createConfirmationCreater = createConfirmationCreater;
exports.default = (0, exports.createConfirmationCreater)((0, domTree_1.createDomTreeMounter)());
