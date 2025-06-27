import { createReactTreeMounter, createMountPoint } from './mounter/reactTree';
import { createConfirmationCreater } from './createConfirmation';

export function createConfirmationContext(mountNode) {
    const mounter = createReactTreeMounter(mountNode);
    const createConfirmation = createConfirmationCreater(mounter);
    const ConfirmationRoot = createMountPoint(mounter);

    return {
        createConfirmation: (component, unmountDelay) => createConfirmation(component, unmountDelay),
        
        ConfirmationRoot
    };
}

/**
 * Context-aware confirmation system for convenient usage
 * Use this if you don't need custom mount nodes
 */
export const ContextAwareConfirmation = createConfirmationContext();