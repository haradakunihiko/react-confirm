import 'regenerator-runtime/runtime';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import confirmable from '../src/confirmable';
import { createConfirmationContext, ContextAwareConfirmation } from '../src/context';

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

const ConfirmableTestComponent = confirmable<any, any>(TestComponent);

describe('context-aware confirmation', () => {
  test('works via createConfirmationContext', async () => {
    const { createConfirmation, ConfirmationRoot } = createConfirmationContext();
    const confirm = createConfirmation(ConfirmableTestComponent);

    render(<ConfirmationRoot />);

    let promise!: Promise<any>;
    await act(async () => {
      promise = confirm({} as any);
    });
    await waitFor(() => expect(screen.getByTestId('proceed-button')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('proceed-button'));
    await expect(promise).resolves.toBe('proceed');
  });

  test('ContextAwareConfirmation singleton works', async () => {
    const { createConfirmation, ConfirmationRoot } = ContextAwareConfirmation;
    const confirm = createConfirmation(ConfirmableTestComponent);

    render(<ConfirmationRoot />);

    let promise!: Promise<any>;
    await act(async () => {
      promise = confirm({} as any);
    });
    await waitFor(() => expect(screen.getByTestId('cancel-button')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('cancel-button'));
    await waitFor(() => expect(promise).rejects.toBe('cancel'));
  });
});
