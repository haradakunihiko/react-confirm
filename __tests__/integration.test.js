// integration.test.js
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

import { render, screen, fireEvent, act } from '@testing-library/react';

import React from 'react';
import { createConfirmationCreater, createDomTreeMounter, createReactTreeMounter, confirmable, createMountPoint } from '../src';

const MyComponent = ({ cancel, dismiss, proceed, show }) => {
  if (!show) return null;

  return (
    <div>
      <button data-testid="cancel-button" onClick={() => cancel('cancel')}>
        Cancel
      </button>
      <button data-testid="dismiss-button" onClick={dismiss}>
        Dismiss
      </button>
      <button data-testid="proceed-button" onClick={() => proceed('proceed')}>
        Proceed
      </button>
    </div>
  );
};

const ConfirmableMyComponent = confirmable(MyComponent);

// Create the confirm function with createDomTreeMounter
const confirmWithDomTree = createConfirmationCreater(createDomTreeMounter())(ConfirmableMyComponent);

const reactTreeMounter = createReactTreeMounter();
// Create the confirm function with createReactTreeMounter
const confirmWithReactTree = createConfirmationCreater(reactTreeMounter)(ConfirmableMyComponent);

// Create MountPoint for ConfirmableMyComponent with createReactTreeMounter
const MountPoint = createMountPoint(reactTreeMounter);

const testHelper = async (testCase) => {
  const { onProceed, onCancel, useMountPoint } = testCase;

  const reactTreeMounter = useMountPoint ? createReactTreeMounter() : null;
  const confirmFn = useMountPoint
    ? createConfirmationCreater(reactTreeMounter)(ConfirmableMyComponent)
    : confirmWithDomTree;

  if (useMountPoint) {
    const NewMountPoint = createMountPoint(reactTreeMounter);
    render(<NewMountPoint />);
  }

  act(() => {
    confirmFn({}).then(onProceed, onCancel);
  });
};

  
  const testProceed = async (useMountPoint = false) => {
    const onProceed = jest.fn();
    const onCancel = jest.fn();
  
    await testHelper({ onProceed, onCancel, useMountPoint });
  
    expect(screen.getByTestId('proceed-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('proceed-button'));
    await act(() => Promise.resolve()); // Wait for the Promise to resolve
    expect(screen.queryByTestId('proceed-button')).not.toBeInTheDocument();
  
    expect(onProceed).toHaveBeenCalledWith('proceed');
    expect(onCancel).not.toHaveBeenCalled(); // Check if onCancel was not called
  };
  
  const testCancel = async (useMountPoint = false) => {
    const onProceed = jest.fn();
    const onCancel = jest.fn();
  
    await testHelper({ onProceed, onCancel, useMountPoint });
  
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('cancel-button'));
    await act(() => Promise.resolve()); // Wait for the Promise to reject
    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
  
    expect(onProceed).not.toHaveBeenCalled(); // Check if onProceed was not called
    expect(onCancel).toHaveBeenCalledWith('cancel');
  };
  
  const testDismiss = async (useMountPoint = false) => {
    const onProceed = jest.fn();
    const onCancel = jest.fn();
  
    await testHelper({ onProceed, onCancel, useMountPoint });
  
    expect(screen.getByTestId('dismiss-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('dismiss-button'));
    await act(() => Promise.resolve()); // Wait for the Promise to reject
    expect(screen.queryByTestId('dismiss-button')).not.toBeInTheDocument();
  
    expect(onProceed).not.toHaveBeenCalled(); // Check if onProceed was not called
    expect(onCancel).not.toHaveBeenCalled(); // Check if onCancel was not called
  };
  
  describe('react-confirm integration test', () => {
    describe('with createDomTreeMounter', () => {
      test('proceed works as expected', () => testProceed());
      test('cancel works as expected', () => testCancel());
      test('dismiss works as expected', () => testDismiss());
    });
  
    describe('with createReactTreeMounter', () => {
      test('proceed works as expected', () => testProceed(true));
      test('cancel works as expected', () => testCancel(true));
      test('dismiss works as expected', () => testDismiss(true));
    });
  });
  