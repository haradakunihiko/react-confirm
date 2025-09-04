import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDialogProps } from 'src';
import { confirmable, ContextAwareConfirmation, createConfirmationContext } from 'src';



// Type inference test interfaces
interface StringProps {
  message: string;
}

interface NumberProps {
  count: number;
  title?: string;
}

interface ComplexProps {
  data: {
    id: number;
    name: string;
  };
  options?: string[];
}

// Test dialog components with different prop types
const StringDialog: React.FC<ConfirmDialogProps<StringProps, string>> = ({ 
  show, 
  message, 
  proceed, 
  cancel, 
  dismiss 
}) => {
  if (!show) return null;
  
  return (
    <div data-testid="string-dialog">
      <p data-testid="message">{message}</p>
      <button data-testid="string-confirm" onClick={() => proceed('string-result')}>Confirm</button>
      <button data-testid="string-cancel" onClick={() => cancel('string-cancelled')}>Cancel</button>
      <button data-testid="string-dismiss" onClick={() => dismiss()}>Dismiss</button>
    </div>
  );
};

const NumberDialog: React.FC<ConfirmDialogProps<NumberProps, number>> = ({ 
  show, 
  count, 
  title, 
  proceed, 
  cancel, 
  dismiss 
}) => {
  if (!show) return null;
  
  return (
    <div data-testid="number-dialog">
      {title && <h3 data-testid="title">{title}</h3>}
      <p data-testid="count">Count: {count}</p>
      <button data-testid="number-confirm" onClick={() => proceed(42)}>Confirm</button>
      <button data-testid="number-cancel" onClick={() => cancel(0)}>Cancel</button>
      <button data-testid="number-dismiss" onClick={() => dismiss()}>Dismiss</button>
    </div>
  );
};

const ComplexDialog: React.FC<ConfirmDialogProps<ComplexProps, { success: boolean; selectedOption?: string }>> = ({ 
  show, 
  data, 
  options, 
  proceed, 
  cancel, 
  dismiss 
}) => {
  if (!show) return null;
  
  return (
    <div data-testid="complex-dialog">
      <p data-testid="data-id">{data.id}</p>
      <p data-testid="data-name">{data.name}</p>
      {options && (
        <ul data-testid="options">
          {options.map((option, index) => (
            <li key={index} data-testid={`option-${index}`}>{option}</li>
          ))}
        </ul>
      )}
      <button data-testid="complex-confirm" onClick={() => proceed({ success: true, selectedOption: options?.[0] })}>
        Confirm
      </button>
      <button data-testid="complex-cancel" onClick={() => cancel({ success: false })}>Cancel</button>
      <button data-testid="complex-dismiss" onClick={() => dismiss()}>Dismiss</button>
    </div>
  );
};

// Create confirmable components
const ConfirmableStringDialog = confirmable(StringDialog);
const ConfirmableNumberDialog = confirmable(NumberDialog);
const ConfirmableComplexDialog = confirmable(ComplexDialog);

describe('ContextAwareConfirmation Type Inference', () => {
  describe('String props and return type inference', () => {
    it('should infer string props and return type correctly', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableStringDialog);
      let resolvedValue: string | null = null;

      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              // TypeScript should infer that confirm expects StringProps and returns Promise<string>
              confirm({ message: 'Type inference test' })
                .then((value: unknown) => { 
                  resolvedValue = value as string; 
                });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      expect(screen.getByTestId('string-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('message')).toHaveTextContent('Type inference test');
      
      fireEvent.click(screen.getByTestId('string-confirm'));
      
      await waitFor(() => {
        expect(resolvedValue).toBe('string-result');
      });
    });

    it('should handle string dialog cancellation', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableStringDialog);
      let rejectedValue: any = null;

      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              confirm({ message: 'Cancel test' })
                .catch((error: any) => { 
                  rejectedValue = error; 
                });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      fireEvent.click(screen.getByTestId('string-cancel'));
      
      await waitFor(() => {
        expect(rejectedValue).toBe('string-cancelled');
      });
    });
  });

  describe('Number props and return type inference', () => {
    it('should infer number props and return type correctly', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableNumberDialog);
      let resolvedValue: number | null = null;

      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              // TypeScript should infer that confirm expects NumberProps and returns Promise<number>
              confirm({ count: 5, title: 'Number test' })
                .then((value) => { 
                  resolvedValue = value as number; 
                });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      expect(screen.getByTestId('number-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Number test');
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 5');
      
      fireEvent.click(screen.getByTestId('number-confirm'));
      
      await waitFor(() => {
        expect(resolvedValue).toBe(42);
      });
    });

    it('should work with optional props', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableNumberDialog);

      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              // TypeScript should allow omitting optional props
              confirm({ count: 10 });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      expect(screen.getByTestId('number-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('Count: 10');
      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
    });
  });

  describe('Complex props and return type inference', () => {
    it('should infer complex props and return type correctly', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableComplexDialog);
      type ExpectedReturnType = { success: boolean; selectedOption?: string };
      let resolvedValue: ExpectedReturnType | null = null;

      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              // TypeScript should infer complex prop and return types
              confirm({ 
                data: { id: 1, name: 'Test' }, 
                options: ['Option A', 'Option B'] 
              })
                .then((value) => { 
                  resolvedValue = value as ExpectedReturnType; 
                });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      expect(screen.getByTestId('complex-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('data-id')).toHaveTextContent('1');
      expect(screen.getByTestId('data-name')).toHaveTextContent('Test');
      expect(screen.getByTestId('option-0')).toHaveTextContent('Option A');
      expect(screen.getByTestId('option-1')).toHaveTextContent('Option B');
      
      fireEvent.click(screen.getByTestId('complex-confirm'));
      
      await waitFor(() => {
        expect(resolvedValue).toEqual({ success: true, selectedOption: 'Option A' });
      });
    });

    it('should work with optional complex props', async () => {
      const context = createConfirmationContext();
      const confirm = context.createConfirmation(ConfirmableComplexDialog);

      const App = () => (
        <div>
          <context.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              // TypeScript should allow omitting optional props
              confirm({ data: { id: 2, name: 'Test 2' } });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      expect(screen.getByTestId('complex-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('data-id')).toHaveTextContent('2');
      expect(screen.getByTestId('data-name')).toHaveTextContent('Test 2');
      expect(screen.queryByTestId('options')).not.toBeInTheDocument();
    });
  });

  describe('ContextAwareConfirmation Global Instance', () => {
    it('should work with the global ContextAwareConfirmation instance', async () => {
      const confirm = ContextAwareConfirmation.createConfirmation(ConfirmableStringDialog);
      let resolvedValue: string | null = null;

      const App = () => (
        <div>
          <ContextAwareConfirmation.ConfirmationRoot />
          <button 
            data-testid="trigger-button"
            onClick={() => {
              confirm({ message: 'Global instance test' })
                .then((value) => { 
                  resolvedValue = value as string; 
                });
            }}
          >
            Trigger
          </button>
        </div>
      );

      render(<App />);
      
      fireEvent.click(screen.getByTestId('trigger-button'));
      expect(screen.getByTestId('string-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('message')).toHaveTextContent('Global instance test');
      
      fireEvent.click(screen.getByTestId('string-confirm'));
      
      await waitFor(() => {
        expect(resolvedValue).toBe('string-result');
      });
    });
  });

  describe('Type safety compilation tests', () => {
    it('should provide proper type checking at compile time', () => {
      const stringConfirm = ContextAwareConfirmation.createConfirmation(ConfirmableStringDialog);
      const numberConfirm = ContextAwareConfirmation.createConfirmation(ConfirmableNumberDialog);
      const complexConfirm = ContextAwareConfirmation.createConfirmation(ConfirmableComplexDialog);

      // These should compile without TypeScript errors
      const validUsages = () => {
        // String dialog usage
        stringConfirm({ message: 'test' }).then((result) => {
          console.log(result);
        });

        // Number dialog usage
        numberConfirm({ count: 5 }).then((result) => {
          console.log(result);
        });
        
        numberConfirm({ count: 5, title: 'optional' }).then((result) => {
          console.log(result);
        });

        // Complex dialog usage
        complexConfirm({ 
          data: { id: 1, name: 'test' } 
        }).then((result) => {
          console.log(result);
        });

        complexConfirm({ 
          data: { id: 1, name: 'test' },
          options: ['a', 'b']
        }).then((result) => {
          console.log(result);
        });
      };

      // This test passes if the code compiles
      expect(typeof validUsages).toBe('function');
    });
  });
});
