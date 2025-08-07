import React from 'react';
import type { ConfirmableDialog } from './confirmable';
export type Mounter = {
    mount: (component: React.ComponentType, props: any, mountNode?: HTMLElement) => string;
    unmount: (key: string) => void;
};
export declare const createConfirmationCreater: (mounter: Mounter) => <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay?: number, mountingNode?: HTMLElement) => (props: P) => Promise<R>;
declare const _default: <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay?: number, mountingNode?: HTMLElement) => (props: P) => Promise<R>;
export default _default;
