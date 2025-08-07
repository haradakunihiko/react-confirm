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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactTreeMounter = createReactTreeMounter;
exports.createMountPoint = createMountPoint;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = __importStar(require("react"));
var useState = React.useState, useEffect = React.useEffect;
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
            mountNode: mountNode
        }
    };
}
function createMountPoint(reactTreeMounter) {
    return function () {
        var _a = useState({}), confirmComponents = _a[0], setConfirmComponents = _a[1];
        useEffect(function () {
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
