import { createReactTreeMounter, createMountPoint } from './mounter/reactTree';
import { createConfirmationCreater } from './createConfirmation';

/**
 * Creates a React context-aware confirmation system.
 * This provides a simple interface for using confirmations within React component tree.
 * 
 * @param {HTMLElement} [mountNode] - Optional DOM node to mount dialogs in
 * @returns {Object} Object containing createConfirmation function and ConfirmationRoot component
 */
export function createConfirmationContext(mountNode) {
    const mounter = createReactTreeMounter(mountNode);
    const createConfirmation = createConfirmationCreater(mounter);
    const ConfirmationRoot = createMountPoint(mounter);

    return {
        /**
         * Creates a confirmation function for a given component
         * @param {React.ComponentType} component - The confirmable component
         * @param {number} [unmountDelay=1000] - Delay before unmounting the component
         * @returns {Function} Confirmation function that returns a Promise
         */
        createConfirmation: (component, unmountDelay) => createConfirmation(component, unmountDelay),
        
        /**
         * React component that must be rendered in your app to display confirmations
         * Place this component at the root level of your app or where you want confirmations to appear
         */
        ConfirmationRoot
    };
}

/**
 * Context-aware confirmation system for convenient usage
 * Use this if you don't need custom mount nodes
 */
export const ContextAwareConfirmation = createConfirmationContext();