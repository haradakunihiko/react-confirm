import type React from 'react';
import { createDomTreeMounter } from './mounter/domTree';
import type { ConfirmableDialog, Mounter } from './types';

export const createConfirmationCreater = (mounter: Mounter) =>
  <P, R>(Component: ConfirmableDialog<P, R>, unmountDelay: number = 1000, mountingNode?: HTMLElement) => {
    return (props: P): Promise<R> => {
      let mountId: string;
      const promise = new Promise<R>((resolve, reject) => {
        try {
          mountId = mounter.mount(Component as React.ComponentType<any>, { reject, resolve, dispose, ...props }, mountingNode);
        } catch (e) {
          // keep behavior identical to JS version
          console.error(e);
          throw e;
        }
      });

      function dispose() {
        setTimeout(() => {
          mounter.unmount(mountId);
        }, unmountDelay);
      }

      return promise.then(
        (result) => {
          dispose();
          return result;
        },
        (result) => {
          dispose();
          return Promise.reject(result);
        }
      );
    };
  };

export default createConfirmationCreater(createDomTreeMounter());
