import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { TreeMounter } from '../types';

type ConfirmsMap = Record<string, { Component: React.ComponentType<any>; props: any }>;

export function createReactTreeMounter(mountNode?: Element | DocumentFragment | HTMLElement): TreeMounter {
  const confirms: ConfirmsMap = {};
  const callbacks: { mounted?: (components: ConfirmsMap) => void } = {};

  function mount(Component: React.ComponentType<any>, props: any, _mountNode?: HTMLElement) {
    const key = Math.floor(Math.random() * (1 << 30)).toString(16);
    confirms[key] = { Component, props };
    callbacks.mounted && callbacks.mounted(confirms);
    return key;
    // _mountNode is ignored - ReactTreeMounter uses options.mountNode instead
  }

  function unmount(key: string) {
    delete confirms[key];
    callbacks.mounted && callbacks.mounted(confirms);
  }

  function setMountedCallback(func: (components: ConfirmsMap) => void) {
    callbacks.mounted = func;
  }

  return {
    mount,
    unmount,
    options: {
      setMountedCallback,
      mountNode,
    },
  };
}

export function createMountPoint(reactTreeMounter: TreeMounter) {
  return () => {
    const [confirmComponents, setConfirmComponents] = useState<ConfirmsMap>({});

    useEffect(() => {
      return reactTreeMounter.options.setMountedCallback((components) => {
        setConfirmComponents({ ...components });
      });
    }, []);

    let element = (
      <>
        {Object.keys(confirmComponents).map((key) => {
          const { Component, props } = confirmComponents[key];
          return <Component key={key} {...props} />;
        })}
      </>
    );
    if (reactTreeMounter.options.mountNode) {
      element = createPortal(element, reactTreeMounter.options.mountNode);
    }

    return element;
  };
}
