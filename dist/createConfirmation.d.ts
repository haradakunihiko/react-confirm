import type { ConfirmableDialog, Mounter } from './types';
export declare const createConfirmationCreater: (mounter: Mounter) => <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay?: number, mountingNode?: HTMLElement) => (props: P) => Promise<R>;
declare const _default: <P, R>(component: ConfirmableDialog<P, R>, unmountDelay?: number, mountingNode?: HTMLElement) => (props: P) => Promise<R>;
export default _default;
