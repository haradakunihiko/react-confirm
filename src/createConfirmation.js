import { createDomTreeMounter } from './mounter/domTree';

export const createConfirmationCreater = (mounter) =>  (Component, unmountDelay = 1000, mountingNode) => {
  return (props) => {
    let mountId;
    const promise = new Promise((resolve, reject) => {
      try {
        mountId = mounter.mount(Component, { reject, resolve, dispose, ...props}, mountingNode)
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
