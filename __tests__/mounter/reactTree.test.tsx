// createReactTreeMounter.test.tsx
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils'; 
import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';

import { createReactTreeMounter, createMountPoint } from '../../src/mounter/reactTree';

const MyComponent = ({ text }: any) => <div data-testid="my-component">{text}</div>;

describe('createReactTreeMounter and createMountPoint', () => {
  let mounter: ReturnType<typeof createReactTreeMounter>;
  let MountPoint: React.ComponentType;

  beforeEach(() => {
    mounter = createReactTreeMounter();
    MountPoint = createMountPoint(mounter);
  });

  test('mounts a component and unmounts it', () => {
    render(<MountPoint />);
  
    let key: string;
    act(() => {
      key = mounter.mount(MyComponent as any, { text: 'Hello, world!' });
    });
  
    const mountedComponent = screen.getByTestId('my-component');
    expect(mountedComponent).toBeInTheDocument();
    expect(mountedComponent).toHaveTextContent('Hello, world!');
  
    act(() => {
      mounter.unmount(key!);
    });
  
    const unmountedComponent = screen.queryByTestId('my-component');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
  

  test('mounts a component in a specific mount node', () => {
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);
  
    const mounterWithNode = createReactTreeMounter(mountNode);
    const MountPointWithNode = createMountPoint(mounterWithNode);
  
    render(<MountPointWithNode />);
  
    let key: string;
    act(() => {
      key = mounterWithNode.mount(MyComponent as any, { text: 'Hello, world!' });
    });
  
    const mountedComponent = mountNode.querySelector('[data-testid="my-component"]')!;
    expect(mountedComponent).toBeInTheDocument();
    expect(mountedComponent.textContent).toContain('Hello, world!');
  
    act(() => {
      mounterWithNode.unmount(key!);
    });
  
    const unmountedComponent = mountNode.querySelector('[data-testid="my-component"]');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
  
});

// Create a test context
const TestContext = React.createContext<string | undefined>(undefined);

const MyComponentWithContext = () => {
  const contextValue = useContext(TestContext);
  return <div data-testid="my-component">{contextValue}</div>;
};

describe('createReactTreeMounter and createMountPoint with context', () => {
  let mounter: ReturnType<typeof createReactTreeMounter>;
  let MountPoint: React.ComponentType;

  beforeEach(() => {
    mounter = createReactTreeMounter();
    MountPoint = createMountPoint(mounter);
  });

  test('mounts a component with context', () => {
    render(
      <TestContext.Provider value="Hello, world!">
        <MountPoint />
      </TestContext.Provider>
    );
  
    let key: string;
    act(() => {
      key = mounter.mount(MyComponentWithContext as any, {});
    });
  
    const mountedComponent = screen.getByTestId('my-component');
    expect(mountedComponent).toBeInTheDocument();
    expect(mountedComponent).toHaveTextContent('Hello, world!');
  
    act(() => {
      mounter.unmount(key!);
    });
  
    const unmountedComponent = screen.queryByTestId('my-component');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
});

