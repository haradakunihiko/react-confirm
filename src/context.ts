import * as React from 'react';
import { createReactTreeMounter, createMountPoint, TreeMounter } from './mounter/reactTree';
import { createConfirmationCreater } from './createConfirmation';
import type { ConfirmableDialog } from './confirmable';

export interface ConfirmationContext {
  /**
   * Creates a confirmation function for a given component
   * @param component - The confirmable component
   * @param unmountDelay - Delay before unmounting the component (default: 1000ms)
   * @returns Confirmation function that returns a Promise
   */
  createConfirmation: <P, R>(
    component: ConfirmableDialog<P, R>,
    unmountDelay?: number
  ) => (props: P) => Promise<R>;

  /**
   * React component that must be rendered in your app to display confirmations
   * Place this component at the root level of your app or where you want confirmations to appear
   */
  ConfirmationRoot: React.ComponentType;
}

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