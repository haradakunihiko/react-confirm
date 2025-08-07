import * as React from 'react';
import { createRoot } from 'react-dom/client';
import type { Mounter } from '../types';

export function createDomTreeMounter(
  defaultMountNode?: Element | DocumentFragment | HTMLElement
): Mounter {
  const confirms: { [key: string]: HTMLElement } = {};
  const callbacks: { mounted?: () => void } = {};

  function mount(
    Component: React.ComponentType,
    props: any,
    mountNode?: HTMLElement
  ): string {
    const key = Math.floor(Math.random() * (1 << 30)).toString(16);
    const wrapper = (mountNode || defaultMountNode || document.body).appendChild(document.createElement('div'));
    confirms[key] = wrapper;

    const root = createRoot(wrapper);
    
    root.render(<Component {...props} />);
    callbacks.mounted && callbacks.mounted();
    return key;
  }

  function unmount(key: string): void {
    const wrapper = confirms[key];
    delete confirms[key];
    
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
  
  return {
    mount, 
    unmount
  };
}