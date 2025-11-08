import confirmable from './confirmable';
import createConfirmation, { createConfirmationCreater } from './createConfirmation';
import { createDomTreeMounter } from './mounter/domTree';
import { createReactTreeMounter, createMountPoint } from './mounter/reactTree';
import { createConfirmationContext, ContextAwareConfirmation } from './context';
import { close as closeConfirmation, closeAll as closeAllConfirmations } from './controls';
export type { ConfirmDialogProps, ConfirmDialog, ConfirmableDialog, Mounter, TreeMounter, ConfirmationContext, ConfirmationOptions, } from './types';
export { confirmable, createConfirmation, createConfirmationCreater, createDomTreeMounter, createReactTreeMounter, createMountPoint, createConfirmationContext, ContextAwareConfirmation, closeConfirmation as close, closeAllConfirmations as closeAll, };
