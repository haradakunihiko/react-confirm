import * as React from 'react';

type ConfirmableProps<P, R> = {
    dispose: () => void;
    resolve: (value: R | PromiseLike<R>) => void;
    reject: (reason?: any) => void;
} & P;

type ConfirmableDialog<P, R> = React.ComponentType<ConfirmableProps<P, R>>;

export type ConfirmDialogProps<P, R> = {
  /** Dismiss dialog without resolving the promise. */
  dismiss: () => void;
  /** Resolve the promise with the given value. */
  proceed: (value: R) => void;
  /** Reject the promise with the given value. */
  cancel: (value?: any) => void;
  /** Indicates if the dialog should be shown aka. someone is waiting for a promise. */
  show: boolean;
} & P;

export type ConfirmDialog<P, R> = React.ComponentType<ConfirmDialogProps<P, R>> ;

export declare function confirmable<P, R>(
    component: ConfirmDialog<P, R>
): ConfirmableDialog<P, R>;

export declare function createConfirmation<P, R>(
    component: ConfirmableDialog<P, R>,
    unmountDelay?: number,
    mountingNode?: HTMLElement,
): (props: P) => Promise<R>;

type Mounter = {
  mount: (component: React.ComponentType, props: any, mountNode?: HTMLElement) => string
  unmount: (key: string) => void
}

type TreeMounter = {
  options: {
      setMountedCallback: (callback: (components: any) => void) => void
      mountNode?: Element | DocumentFragment | HTMLElement
  }
} & Mounter

export declare function createReactTreeMounter(mountNode?: Element | DocumentFragment | HTMLElement): TreeMounter;
export declare function createMountPoint(mounter: TreeMounter): React.ComponentType;
export declare function createDomTreeMounter(defaultMountNode?: Element | DocumentFragment | HTMLElement): Mounter;
export declare function createConfirmationCreater(mounter: Mounter): typeof createConfirmation;

// Context-aware confirmation system
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
