import type React from 'react';
import { createDomTreeMounter } from './mounter/domTree';
import type { ConfirmableDialog, Mounter, ConfirmationOptions } from './types';
import { register, attachAbortSignal } from './controls';

export const createConfirmationCreater = (mounter: Mounter) =>
  <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay: number = 1000, mountingNode?: HTMLElement) => {
    return (props: P, options?: ConfirmationOptions): Promise<R> => {
      let mountId: string;
      let rejectRef: (reason?: Error) => void = () => {};

      function dispose() {
        setTimeout(() => {
          mounter.unmount(mountId);
        }, unmountDelay);
      }

      const inner = new Promise<R>((resolve, reject) => {
        rejectRef = reject;
        try {
          mountId = mounter.mount(Component as React.ComponentType<any>, { reject, resolve, dispose, ...props }, mountingNode);
        } catch (e) {
          // keep behavior identical to JS version
          console.error(e);
          throw e;
        }
      });

      const wrapped = inner.then(
        (result) => {
          dispose();
          return result;
        },
        (err) => {
          dispose();
          return Promise.reject(err);
        }
      );

      // Register to registry for external cancellation
      register(wrapped, { reject: rejectRef, dispose });

      // Attach AbortSignal if provided
      if (options?.signal) {
        const detach = attachAbortSignal(options.signal, wrapped);
        wrapped.finally(detach).catch(() => {});
      }

      return wrapped;
    };
  };

const defaultCreateConfirmation = createConfirmationCreater(createDomTreeMounter());
export default defaultCreateConfirmation as <P, R>(
  component: ConfirmableDialog<P, R>,
  unmountDelay?: number,
  mountingNode?: HTMLElement
) => (props: P, options?: ConfirmationOptions) => Promise<R>;
