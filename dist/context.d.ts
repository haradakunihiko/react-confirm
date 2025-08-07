import type { ConfirmationContext } from './types';
export declare function createConfirmationContext(mountNode?: Element | DocumentFragment | HTMLElement): ConfirmationContext;
/**
 * Context-aware confirmation system for convenient usage
 * Use this if you don't need custom mount nodes
 */
export declare const ContextAwareConfirmation: ConfirmationContext;
