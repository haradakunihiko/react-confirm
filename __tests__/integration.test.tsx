import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils'; 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { createConfirmationCreater } from '../src/createConfirmation';
import { createDomTreeMounter } from '../src/mounter/domTree';
import { createReactTreeMounter, createMountPoint } from '../src/mounter/reactTree';

const TestComponent = ({ cancel, dismiss, proceed, show }: any) => {
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

describe('integration', () => {
  test('createConfirmationCreater + domTree mounter', async () => {
    const mounter = createDomTreeMounter();
    const confirm = createConfirmationCreater(mounter);
    const ConfirmableComponent = require('../src/confirmable').default(TestComponent);

    const confirmFn = confirm(ConfirmableComponent);
    let result: Promise<any>;
    await act(async () => {
      result = confirmFn({} as any);
    });

    const proceedButton = document.querySelector('[data-testid="proceed-button"]')!;
    fireEvent.click(proceedButton);
    await expect(result!).resolves.toBe('proceed');
  });

  test('reactTree mounter + mount point renders component', async () => {
    const mounter = createReactTreeMounter();
    const MountPoint = createMountPoint(mounter);
    render(<MountPoint />);

    let key: string;
    act(() => {
      key = mounter.mount(() => <div data-testid="hello">Hello</div>, {});
    });
    expect(screen.getByTestId('hello')).toBeInTheDocument();

    act(() => {
      mounter.unmount(key!);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('hello')).not.toBeInTheDocument();
    });
  });
});
