import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import React from 'react';
import confirmable from '../src/confirmable';

const TestComponent = ({ cancel, dismiss, proceed, show }) => {
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

const ConfirmableTestComponent = confirmable(TestComponent);

describe('confirmable', () => {
    test('calls cancel function', async () => {
        const dispose = jest.fn();
        const reject = jest.fn();
        const resolve = jest.fn();
      
        render(
          <ConfirmableTestComponent dispose={dispose} reject={reject} resolve={resolve} />
        );
      
        fireEvent.click(screen.getByTestId('cancel-button'));
        await waitFor(() => expect(reject).toHaveBeenCalledWith('cancel'));
        expect(dispose).toHaveBeenCalledTimes(0);
      });
      
      test('calls dismiss function', async () => {
        const dispose = jest.fn();
        const reject = jest.fn();
        const resolve = jest.fn();
      
        render(
          <ConfirmableTestComponent dispose={dispose} reject={reject} resolve={resolve} />
        );
      
        fireEvent.click(screen.getByTestId('dismiss-button'));
        await waitFor(() => expect(dispose).toHaveBeenCalledTimes(1));
      });
      
      test('calls proceed function', async () => {
        const dispose = jest.fn();
        const reject = jest.fn();
        const resolve = jest.fn();
      
        render(
          <ConfirmableTestComponent dispose={dispose} reject={reject} resolve={resolve} />
        );
      
        fireEvent.click(screen.getByTestId('proceed-button'));
        await waitFor(() => expect(resolve).toHaveBeenCalledWith('proceed'));
      });
      

  test('hides the component when show is false', () => {
    const { rerender } = render(
      <TestComponent show={true} />
    );

    expect(screen.queryByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.queryByTestId('dismiss-button')).toBeInTheDocument();
    expect(screen.queryByTestId('proceed-button')).toBeInTheDocument();

    rerender(<TestComponent show={false} />);

    expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dismiss-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('proceed-button')).not.toBeInTheDocument();
  });
});
