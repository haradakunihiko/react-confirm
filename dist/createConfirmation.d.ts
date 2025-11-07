import type { ConfirmableDialog, Mounter, ConfirmationOptions } from './types';
export declare const createConfirmationCreater: (mounter: Mounter) => <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay?: number, mountingNode?: HTMLElement) => (props: P, options?: ConfirmationOptions) => Promise<R>;
declare const _default: <P, R>(component: ConfirmableDialog<P, R>, unmountDelay?: number, mountingNode?: HTMLElement) => (props: P, options?: ConfirmationOptions) => Promise<R>;
export default _default;
