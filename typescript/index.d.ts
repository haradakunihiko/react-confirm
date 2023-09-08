import * as React from 'react';

type ConfirmableProps<P, R> = {
    dispose: () => void;
    resolve: PromiseLike<R>;
    reject: (reason?: any) => void;
} & P;

type ConfirmableDialog<P, R> = React.ComponentType<ConfirmableProps<P, R>>;

export type ConfirmDialogProps<P, R> = {
  dismiss: () => void;
  proceed: (value: R) => void;
  cancel: (value?: any) => void;
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
