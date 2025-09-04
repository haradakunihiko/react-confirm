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
exports.createReactTreeMounter = createReactTreeMounter;
exports.createMountPoint = createMountPoint;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
function createReactTreeMounter(mountNode) {
    var confirms = {};
    var callbacks = {};
    function mount(Component, props, _mountNode) {
        var key = Math.floor(Math.random() * (1 << 30)).toString(16);
        confirms[key] = { Component: Component, props: props };
        callbacks.mounted && callbacks.mounted(confirms);
        return key;
        // _mountNode is ignored - ReactTreeMounter uses options.mountNode instead
    }
    function unmount(key) {
        delete confirms[key];
        callbacks.mounted && callbacks.mounted(confirms);
    }
    function setMountedCallback(func) {
        callbacks.mounted = func;
    }
    return {
        mount: mount,
        unmount: unmount,
        options: {
            setMountedCallback: setMountedCallback,
            mountNode: mountNode,
        },
    };
}
function createMountPoint(reactTreeMounter) {
    return function () {
        var _a = (0, react_1.useState)({}), confirmComponents = _a[0], setConfirmComponents = _a[1];
        (0, react_1.useEffect)(function () {
            return reactTreeMounter.options.setMountedCallback(function (components) {
                setConfirmComponents(__assign({}, components));
            });
        }, []);
        var element = ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Object.keys(confirmComponents).map(function (key) {
                var _a = confirmComponents[key], Component = _a.Component, props = _a.props;
                return (0, jsx_runtime_1.jsx)(Component, __assign({}, props), key);
            }) }));
        if (reactTreeMounter.options.mountNode) {
            element = (0, react_dom_1.createPortal)(element, reactTreeMounter.options.mountNode);
        }
        return element;
    };
}
