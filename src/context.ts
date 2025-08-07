import { createReactTreeMounter, createMountPoint } from './mounter/reactTree';
import { createConfirmationCreater } from './createConfirmation';
import type { ConfirmableDialog, ConfirmationContext } from './types';

export function createConfirmationContext(
  mountNode?: Element | DocumentFragment | HTMLElement
): ConfirmationContext {
    const mounter = createReactTreeMounter(mountNode);
    const createConfirmation = createConfirmationCreater(mounter);
    const ConfirmationRoot = createMountPoint(mounter);

    return {
        createConfirmation: <P, R>(
            component: ConfirmableDialog<P, R>,
            unmountDelay?: number
        ) => createConfirmation(component, unmountDelay),
        
        ConfirmationRoot
    };
}

/**
 * Context-aware confirmation system for convenient usage
 * Use this if you don't need custom mount nodes
 */
export const ContextAwareConfirmation = createConfirmationContext();