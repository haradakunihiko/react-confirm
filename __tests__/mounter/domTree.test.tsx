import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import React from 'react';

import { createDomTreeMounter } from '../../src/mounter/domTree';

const MyComponent = ({ text }: any) => <div data-testid="my-component">{text}</div>;

describe('createDomTreeMounter', () => {
  test('mounts a component and unmounts it', () => {
    const mounter = createDomTreeMounter();
    let key: string;
    act(() => {
      key = mounter.mount(MyComponent as any, { text: 'Hello, world!' });
    });
    const mounted = document.querySelector('[data-testid="my-component"]') as HTMLElement;
    expect(mounted).toBeInTheDocument();
    expect(mounted.textContent).toContain('Hello, world!');

    act(() => {
      mounter.unmount(key!);
    });
    const unmounted = document.querySelector('[data-testid="my-component"]');
    expect(unmounted).not.toBeInTheDocument();
  });
});

