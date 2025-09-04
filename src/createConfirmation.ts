import * as React from 'react';
import { createDomTreeMounter } from './mounter/domTree';
import type { ConfirmableDialog, Mounter } from './types';
import { register, attachAbortSignal } from './controls';

export const createConfirmationCreater = (mounter: Mounter) => <P, R>(
  Component: ConfirmableDialog<P, R>,
  unmountDelay: number = 1000,
  mountingNode?: HTMLElement
) => {
  return (props: P, control?: { signal?: AbortSignal }): Promise<R> => {
    let mountId: string;
    let rejectRef: (reason?: any) => void = () => {};

    function dispose() {
      setTimeout(() => {
        mounter.unmount(mountId);
      }, unmountDelay);
    }

    const inner = new Promise<R>((resolve, reject) => {
      rejectRef = reject;
      try {
        mountId = mounter.mount(
          Component as React.ComponentType,
          { reject, resolve, dispose, ...props },
          mountingNode
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    });

    const wrapped = inner.then(
      (result) => { dispose(); return result; },
      (err) => { dispose(); return Promise.reject(err); }
    );

    // register for external cancellation
    register(wrapped, { reject: rejectRef, dispose });

    // Attach AbortSignal if provided
    if (control?.signal) {
      const detach = attachAbortSignal(control.signal, wrapped);
      wrapped.finally(detach).catch(() => {});
    }

    return wrapped;
  }
}

export default createConfirmationCreater(createDomTreeMounter());
