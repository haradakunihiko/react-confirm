import type { ConfirmableProps, ConfirmDialog } from './types';
declare const confirmable: <P, R>(Component: ConfirmDialog<P, R>) => ({ dispose, reject, resolve, ...other }: ConfirmableProps<P, R>) => import("react/jsx-runtime").JSX.Element;
export default confirmable;
