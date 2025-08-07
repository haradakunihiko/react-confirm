"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAwareConfirmation = void 0;
exports.createConfirmationContext = createConfirmationContext;
var reactTree_1 = require("./mounter/reactTree");
var createConfirmation_1 = require("./createConfirmation");
function createConfirmationContext(mountNode) {
    var mounter = (0, reactTree_1.createReactTreeMounter)(mountNode);
    var createConfirmation = (0, createConfirmation_1.createConfirmationCreater)(mounter);
    var ConfirmationRoot = (0, reactTree_1.createMountPoint)(mounter);
    return {
        createConfirmation: function (component, unmountDelay) { return createConfirmation(component, unmountDelay); },
        ConfirmationRoot: ConfirmationRoot
    };
}
/**
 * Context-aware confirmation system for convenient usage
 * Use this if you don't need custom mount nodes
 */
exports.ContextAwareConfirmation = createConfirmationContext();
