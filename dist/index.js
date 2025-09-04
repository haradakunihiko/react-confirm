"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAwareConfirmation = exports.createConfirmationContext = exports.createMountPoint = exports.createReactTreeMounter = exports.createDomTreeMounter = exports.createConfirmationCreater = exports.createConfirmation = exports.confirmable = void 0;
var confirmable_1 = __importDefault(require("./confirmable"));
exports.confirmable = confirmable_1.default;
var createConfirmation_1 = __importStar(require("./createConfirmation"));
exports.createConfirmation = createConfirmation_1.default;
Object.defineProperty(exports, "createConfirmationCreater", { enumerable: true, get: function () { return createConfirmation_1.createConfirmationCreater; } });
var domTree_1 = require("./mounter/domTree");
Object.defineProperty(exports, "createDomTreeMounter", { enumerable: true, get: function () { return domTree_1.createDomTreeMounter; } });
var reactTree_1 = require("./mounter/reactTree");
Object.defineProperty(exports, "createReactTreeMounter", { enumerable: true, get: function () { return reactTree_1.createReactTreeMounter; } });
Object.defineProperty(exports, "createMountPoint", { enumerable: true, get: function () { return reactTree_1.createMountPoint; } });
var context_1 = require("./context");
Object.defineProperty(exports, "createConfirmationContext", { enumerable: true, get: function () { return context_1.createConfirmationContext; } });
Object.defineProperty(exports, "ContextAwareConfirmation", { enumerable: true, get: function () { return context_1.ContextAwareConfirmation; } });
