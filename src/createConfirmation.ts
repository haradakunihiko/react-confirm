import React from 'react';
import { createDomTreeMounter } from './mounter/domTree';
import type { ConfirmableDialog } from './confirmable';

export type Mounter = {
  mount: (component: React.ComponentType, props: any, mountNode?: HTMLElement) => string
  unmount: (key: string) => void
}

export const createConfirmationCreater = (mounter: Mounter) => <P, R>(
  Component: ConfirmableDialog<P, R>,
  unmountDelay: number = 1000,
  mountingNode?: HTMLElement
) => {
  return (props: P): Promise<R> => {
    let mountId: string;
    const promise = new Promise<R>((resolve, reject) => {
      try {
        mountId = mounter.mount(Component as React.ComponentType, { reject, resolve, dispose, ...props}, mountingNode)
      } catch (e) {
        console.error(e);
        throw e;
      }
    })

    function dispose() {
      setTimeout(() => {
        mounter.unmount(mountId);
      }, unmountDelay);
    }

    return promise.then((result) => {
      dispose();
      return result;
    }, (result) => {
      dispose();
      return Promise.reject(result);
    });
  }
}

export default createConfirmationCreater(createDomTreeMounter());
