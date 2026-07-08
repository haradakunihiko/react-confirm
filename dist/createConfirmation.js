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
        return function (props) {
            var mountId;
            var resolveRef = function () { };
            var rejectRef = function () { };
            var setShowRef;
            var wrapped;
            function dispose() {
                if (wrapped)
                    (0, controls_1.unregister)(wrapped);
                setTimeout(function () {
                    mounter.unmount(mountId);
                }, unmountDelay);
            }
            // Callback for confirmable to register its setShow function
            var registerSetShow = function (setShow) {
                setShowRef = setShow;
            };
            var inner = new Promise(function (resolve, reject) {
                resolveRef = resolve;
                rejectRef = reject;
                try {
                    mountId = mounter.mount(Component, __assign({ reject: reject, resolve: resolve, dispose: dispose, registerSetShow: registerSetShow }, props), mountingNode);
                }
                catch (e) {
                    // keep behavior identical to JS version
                    console.error(e);
                    throw e;
                }
            });
            wrapped = inner.then(function (result) {
                dispose();
                return result;
            }, function (err) {
                dispose();
                return Promise.reject(err);
            });
            // Register to controls layer for external control
            (0, controls_1.register)(wrapped, {
                resolve: resolveRef,
                reject: rejectRef,
                dispose: dispose,
                get setShow() { return setShowRef; }
            });
            return wrapped;
        };
    };
};
exports.createConfirmationCreater = createConfirmationCreater;
var defaultCreateConfirmation = (0, exports.createConfirmationCreater)((0, domTree_1.createDomTreeMounter)());
exports.default = defaultCreateConfirmation;
