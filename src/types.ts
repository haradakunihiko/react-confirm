import * as React from 'react';

// Core types for the confirmation system
export type ConfirmableProps<P, R> = {
    dispose: () => void;
    resolve: (value: R | PromiseLike<R>) => void;
    reject: (reason?: any) => void;
} & P;

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

export type ConfirmDialog<P, R> = React.ComponentType<ConfirmDialogProps<P, R>>;
export type ConfirmableDialog<P, R> = React.ComponentType<ConfirmableProps<P, R>>;

// Mounter types
export type Mounter = {
  mount: (component: React.ComponentType, props: any, mountNode?: HTMLElement) => string
  unmount: (key: string) => void
}

export type TreeMounter = {
  options: {
      setMountedCallback: (callback: (components: any) => void) => void
      mountNode?: Element | DocumentFragment | HTMLElement
  }
} & Mounter

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