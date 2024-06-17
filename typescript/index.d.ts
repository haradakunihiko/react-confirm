import * as React from 'react';

type ConfirmableProps<P, R> = {
    dispose: () => void;
    resolve: PromiseLike<R>;
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
  /** Additional options passed to the dialog. */
  options: object,
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
  mount: (component: React.ComponentType, ) => string
  unmount: (key: string) => void
}

type TreeMounter = {
  options: {
      setMountedCallback: (callback: any) => void
      mountNode: Element | DocumentFragment
  }
} & Mounter;

export declare function createReactTreeMounter(mountNode?: HTMLElement): TreeMounter;
export declare function createMountPoint(moounter: TreeMounter): React.ComponentType;
export declare function createDomTreeMounter(mountNode?: HTMLElement): Mounter;
export declare function createConfirmationCreater(mounter: Mounter): typeof createConfirmation;
