import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Mounter } from '../types';

export function createDomTreeMounter(defaultMountNode?: Element | DocumentFragment | HTMLElement): Mounter {
  const confirms: Record<string, { wrapper: HTMLElement; root: ReturnType<typeof createRoot> }> = {};
  const callbacks: { mounted?: () => void } = {};

  function mount(Component: React.ComponentType<any>, props: any, mountNode?: HTMLElement) {
    const key = Math.floor(Math.random() * (1 << 30)).toString(16);
    const parent = (mountNode || (defaultMountNode as Element | DocumentFragment) || document.body) as Element | DocumentFragment;
    const wrapper = parent.appendChild(document.createElement('div'));

    const root = createRoot(wrapper);
    root.render(<Component {...props} />);

    confirms[key] = { wrapper, root };
    callbacks.mounted && callbacks.mounted();
    return key;
  }

  function unmount(key: string) {
    const entry = confirms[key];
    delete confirms[key];

    if (entry) {
      entry.root.unmount();
      if (entry.wrapper.parentNode) {
        entry.wrapper.parentNode.removeChild(entry.wrapper);
      }
    }
  }

  return ({
    mount,
    unmount,
    // keep runtime `options` for backward-compat; not part of public type
    options: {},
  } as unknown) as Mounter;
}
