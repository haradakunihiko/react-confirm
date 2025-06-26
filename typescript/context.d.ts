import * as React from 'react';
import { ConfirmDialog, ConfirmableDialog } from './index';

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

/**
 * Creates a React context-aware confirmation system.
 * This provides a simple interface for using confirmations within React component tree.
 * 
 * @param mountNode - Optional DOM node to mount dialogs in
 * @returns Object containing createConfirmation function and ConfirmationRoot component
 */
export declare function createConfirmationContext(
  mountNode?: Element | DocumentFragment | HTMLElement
): ConfirmationContext;

/**
 * Context-aware confirmation system for convenient usage
 * Use this if you don't need custom mount nodes
 */
export declare const ContextAwareConfirmation: ConfirmationContext;