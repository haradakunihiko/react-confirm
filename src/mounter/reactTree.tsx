import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Mounter } from '../createConfirmation';

export type TreeMounter = {
  options: {
      setMountedCallback: (callback: (components: any) => void) => void
      mountNode?: Element | DocumentFragment | HTMLElement
  }
} & Mounter

export function createReactTreeMounter(
  mountNode?: Element | DocumentFragment | HTMLElement
): TreeMounter {
  const confirms: { [key: string]: { Component: React.ComponentType; props: any } } = {};
  const callbacks: { mounted?: (components: any) => void } = {};

  function mount(
    Component: React.ComponentType,
    props: any,
    _mountNode?: HTMLElement
  ): string {
    const key = Math.floor(Math.random() * (1 << 30)).toString(16);
    confirms[key] = { Component, props };
    callbacks.mounted && callbacks.mounted(confirms);
    return key;
    // _mountNode is ignored - ReactTreeMounter uses options.mountNode instead
  }
  
  function unmount(key: string): void {
    delete confirms[key];
    callbacks.mounted && callbacks.mounted(confirms);
  }

  function setMountedCallback(func: (components: any) => void): void {
    callbacks.mounted = func;
  }

  return {
    mount, 
    unmount,
    options: {
      setMountedCallback, 
      mountNode
    }
  };
}

export function createMountPoint(
  reactTreeMounter: TreeMounter
): React.ComponentType {
  return () => {
    const [confirmComponents, setConfirmComponents] = useState<{
      [key: string]: { Component: React.ComponentType; props: any }
    }>({});

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