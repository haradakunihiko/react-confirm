// createDomTreeMounter.test.js
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom/extend-expect';

import { createDomTreeMounter } from '../../src/mounter/domTree';
import React from 'react';

const MyComponent = () => <div data-testid="my-component">Hello, world!</div>;

describe('createDomTreeMounter', () => {
  let mounter;

  beforeEach(() => {
    mounter = createDomTreeMounter();
  });

  test('mounts a component and unmounts it', async () => {
    const key = mounter.mount(MyComponent);

    // Wait for the component to mount
    await new Promise(setTimeout);

    // Check if the component is mounted
    const mountedComponent = document.querySelector('[data-testid="my-component"]');
    expect(mountedComponent).toBeInTheDocument();

    mounter.unmount(key);

    // Check if the component is unmounted
    const unmountedComponent = document.querySelector('[data-testid="my-component"]');
    expect(unmountedComponent).not.toBeInTheDocument();
  });

  test('mounts a component in a specific mount node', async () => {
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);

    const key = mounter.mount(MyComponent, {}, mountNode);

    // Wait for the component to mount
    await new Promise(setTimeout);

    // Check if the component is mounted in the correct mount node
    const mountedComponent = mountNode.querySelector('[data-testid="my-component"]');
    expect(mountedComponent).toBeInTheDocument();

    mounter.unmount(key);

    // Check if the component is unmounted
    const unmountedComponent = mountNode.querySelector('[data-testid="my-component"]');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
});
