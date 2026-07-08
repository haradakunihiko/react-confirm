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
exports.createDomTreeMounter = createDomTreeMounter;
var jsx_runtime_1 = require("react/jsx-runtime");
var client_1 = require("react-dom/client");
function createDomTreeMounter(defaultMountNode) {
    var confirms = {};
    var callbacks = {};
    function mount(Component, props, mountNode) {
        var key = Math.floor(Math.random() * (1 << 30)).toString(16);
        var parent = (mountNode || defaultMountNode || document.body);
        var wrapper = parent.appendChild(document.createElement('div'));
        var root = (0, client_1.createRoot)(wrapper);
        root.render((0, jsx_runtime_1.jsx)(Component, __assign({}, props)));
        confirms[key] = { wrapper: wrapper, root: root };
        callbacks.mounted && callbacks.mounted();
        return key;
    }
    function unmount(key) {
        var entry = confirms[key];
        delete confirms[key];
        if (entry) {
            entry.root.unmount();
            if (entry.wrapper.parentNode) {
                entry.wrapper.parentNode.removeChild(entry.wrapper);
            }
        }
    }
    return {
        mount: mount,
        unmount: unmount,
        // keep runtime `options` for backward-compat; not part of public type
        options: {},
    };
}
