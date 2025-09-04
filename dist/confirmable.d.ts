import type { ConfirmDialog, ConfirmableDialog } from './types';
declare const confirmable: <P, R>(Component: ConfirmDialog<P, R>) => ConfirmableDialog<P, R>;
export default confirmable;
