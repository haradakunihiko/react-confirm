import confirmable from './confirmable';
import createConfirmation, { createConfirmationCreater } from './createConfirmation';
import { createDomTreeMounter } from './mounter/domTree';
import { createReactTreeMounter, createMountPoint } from './mounter/reactTree';
import { createConfirmationContext, ContextAwareConfirmation } from './context';
export type { ConfirmDialogProps, ConfirmDialog, ConfirmationContext, } from './types';
export { confirmable, createConfirmation, createConfirmationCreater, createDomTreeMounter, createReactTreeMounter, createMountPoint, createConfirmationContext, ContextAwareConfirmation };
