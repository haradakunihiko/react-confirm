import 'regenerator-runtime/runtime';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import confirmable from '../src/confirmable';
import { 
  createConfirmationContext, 
  ContextAwareConfirmation
} from '../src/context';

// Simple test dialog component
const TestDialog = ({ cancel, dismiss, proceed, show, message = 'Test message' }) => {
  if (!show) return null;
  
  return (
    <div data-testid="test-dialog">
      <p data-testid="message">{message}</p>
      <button data-testid="proceed-button" onClick={() => proceed('confirmed')}>
        Confirm
      </button>
      <button data-testid="cancel-button" onClick={() => cancel('cancelled')}>
        Cancel
      </button>
      <button data-testid="dismiss-button" onClick={dismiss}>
        Dismiss
      </button>
    </div>
  );
};

const ConfirmableTestDialog = confirmable(TestDialog);

describe('Context API', () => {
  describe('createConfirmationContext', () => {
    it('should create a confirmation context with custom mount node', () => {
      const mountNode = document.createElement('div');
      const context = createConfirmationContext(mountNode);
      
      expect(typeof context.createConfirmation).toBe('function');
      expect(typeof context.ConfirmationRoot).toBe('function');
    });

    it('should create a confirmation context without mount node', () => {
      const context = createConfirmationContext();
      
      expect(typeof context.createConfirmation).toBe('function');
      expect(typeof context.ConfirmationRoot).toBe('function');
    });

    it('should work with custom context', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableTestDialog);
      
      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => confirm({ message: 'Custom context test' })}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      // Trigger confirmation
      fireEvent.click(screen.getByTestId('trigger-button'));
      
      // Should show dialog
      expect(screen.getByTestId('test-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('message')).toHaveTextContent('Custom context test');
    });
  });

  describe('ContextAwareConfirmation', () => {
    it('should provide context functions', () => {
      expect(typeof ContextAwareConfirmation.createConfirmation).toBe('function');
      expect(typeof ContextAwareConfirmation.ConfirmationRoot).toBe('function');
    });

    it('should work with ContextAwareConfirmation', async () => {
      const confirm = ContextAwareConfirmation.createConfirmation(ConfirmableTestDialog);
      let resolvedValue = null;

      const App = () => (
        <div>
          <ContextAwareConfirmation.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              confirm({ message: 'ContextAware test' })
                .then(value => { resolvedValue = value; });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      // Trigger confirmation
      fireEvent.click(screen.getByTestId('trigger-button'));
      
      // Should show dialog
      expect(screen.getByTestId('test-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('message')).toHaveTextContent('ContextAware test');
      
      // Confirm
      fireEvent.click(screen.getByTestId('proceed-button'));
      
      // Wait for promise resolution and component cleanup
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      
      expect(resolvedValue).toBe('confirmed');
    });
  });

  describe('Context isolation', () => {
    it('should isolate different contexts', async () => {
      const context1 = createConfirmationContext();
      const context2 = createConfirmationContext();
      
      const confirm1 = context1.createConfirmation(ConfirmableTestDialog);
      const confirm2 = context2.createConfirmation(ConfirmableTestDialog);
      
      const App = () => (
        <div>
          <div data-testid="context1">
            <context1.ConfirmationRoot />
          </div>
          <div data-testid="context2">
            <context2.ConfirmationRoot />
          </div>
          <button 
            data-testid="trigger1"
            onClick={() => confirm1({ message: 'Context 1' })}
          >
            Trigger 1
          </button>
          <button 
            data-testid="trigger2"
            onClick={() => confirm2({ message: 'Context 2' })}
          >
            Trigger 2
          </button>
        </div>
      );

      render(<App />);
      
      // Trigger first confirmation
      fireEvent.click(screen.getByTestId('trigger1'));
      expect(screen.getByText('Context 1')).toBeInTheDocument();
      
      // Trigger second confirmation
      fireEvent.click(screen.getByTestId('trigger2'));
      expect(screen.getByText('Context 2')).toBeInTheDocument();
      
      // Both should be visible and isolated
      expect(screen.getAllByTestId('test-dialog')).toHaveLength(2);
    });
  });

  describe('unmountDelay parameter', () => {
    it('should accept unmountDelay parameter', () => {
      const confirm = ContextAwareConfirmation.createConfirmation(ConfirmableTestDialog, 500);
      expect(typeof confirm).toBe('function');
    });

    it('should work with custom unmountDelay in context', () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableTestDialog, 100);
      expect(typeof confirm).toBe('function');
    });
  });
});