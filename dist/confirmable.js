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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var confirmable = function (Component) {
    return function (_a) {
        var dispose = _a.dispose, reject = _a.reject, resolve = _a.resolve, other = __rest(_a, ["dispose", "reject", "resolve"]);
        var _b = (0, react_1.useState)(true), show = _b[0], setShow = _b[1];
        var dismiss = function () {
            setShow(false);
            dispose();
        };
        var cancel = function (value) {
            setShow(false);
            reject(value);
        };
        var proceed = function (value) {
            setShow(false);
            resolve(value);
        };
        return ((0, jsx_runtime_1.jsx)(Component, __assign({ cancel: cancel, dismiss: dismiss, proceed: proceed, show: show }, other)));
    };
};
exports.default = confirmable;
