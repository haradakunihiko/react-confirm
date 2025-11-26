import type React from 'react';
import { createDomTreeMounter } from './mounter/domTree';
import type { ConfirmableDialog, Mounter } from './types';
import { register } from './controls';

export const createConfirmationCreater = (mounter: Mounter) =>
  <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay: number = 1000, mountingNode?: HTMLElement) => {
    return (props: P): Promise<R> => {
      let mountId: string;
      let resolveRef: (value: R) => void = () => {};

      function dispose() {
        setTimeout(() => {
          mounter.unmount(mountId);
        }, unmountDelay);
      }

      let rejectRef: (reason?: any) => void = () => {};

      const inner = new Promise<R>((resolve, reject) => {
        resolveRef = resolve;
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

      // Register to controls layer for external control
      register(wrapped, { resolve: resolveRef, reject: rejectRef, dispose });

      return wrapped;
    };
  };

const defaultCreateConfirmation = createConfirmationCreater(createDomTreeMounter());
export default defaultCreateConfirmation as <P, R>(
  component: ConfirmableDialog<P, R>,
  unmountDelay?: number,
  mountingNode?: HTMLElement
) => (props: P) => Promise<R>;
