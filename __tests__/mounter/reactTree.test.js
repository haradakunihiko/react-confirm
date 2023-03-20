// createReactTreeMounter.test.js
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils'; 
import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';

import { createReactTreeMounter, createMountPoint } from '../../src/mounter/reactTree';


const MyComponent = ({ text }) => <div data-testid="my-component">{text}</div>;

describe('createReactTreeMounter and createMountPoint', () => {
  let mounter;
  let MountPoint;

  beforeEach(() => {
    mounter = createReactTreeMounter();
    MountPoint = createMountPoint(mounter);
  });

  test('mounts a component and unmounts it', () => {
    render(<MountPoint />);
  
    let key;
    act(() => {
      key = mounter.mount(MyComponent, { text: 'Hello, world!' });
    });
  
    // Check if the component is mounted
    const mountedComponent = screen.getByTestId('my-component');
    expect(mountedComponent).toBeInTheDocument();
    expect(mountedComponent).toHaveTextContent('Hello, world!');
  
    act(() => {
      mounter.unmount(key);
    });
  
    // Check if the component is unmounted
    const unmountedComponent = screen.queryByTestId('my-component');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
  

  test('mounts a component in a specific mount node', () => {
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);
  
    const mounterWithNode = createReactTreeMounter(mountNode);
    const MountPointWithNode = createMountPoint(mounterWithNode);
  
    render(<MountPointWithNode />);
  
    let key;
    act(() => {
      key = mounterWithNode.mount(MyComponent, { text: 'Hello, world!' });
    });
  
    // Check if the component is mounted in the correct mount node
    const mountedComponent = mountNode.querySelector('[data-testid="my-component"]');
    expect(mountedComponent).toBeInTheDocument();
    expect(mountedComponent).toHaveTextContent('Hello, world!');
  
    act(() => {
      mounterWithNode.unmount(key);
    });
  
    // Check if the component is unmounted
    const unmountedComponent = mountNode.querySelector('[data-testid="my-component"]');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
  
});


// Create a test context
const TestContext = React.createContext();

const MyComponentWithContext = () => {
  const contextValue = useContext(TestContext);
  return <div data-testid="my-component">{contextValue}</div>;
};


describe('createReactTreeMounter and createMountPoint with context', () => {
  let mounter;
  let MountPoint;

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
  
    let key;
    act(() => {
      key = mounter.mount(MyComponentWithContext);
    });
  
    // Check if the component is mounted and receives the context value
    const mountedComponent = screen.getByTestId('my-component');
    expect(mountedComponent).toBeInTheDocument();
    expect(mountedComponent).toHaveTextContent('Hello, world!');
  
    act(() => {
      mounter.unmount(key);
    });
  
    // Check if the component is unmounted
    const unmountedComponent = screen.queryByTestId('my-component');
    expect(unmountedComponent).not.toBeInTheDocument();
  });
});
