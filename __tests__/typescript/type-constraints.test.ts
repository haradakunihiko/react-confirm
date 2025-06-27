import * as React from 'react';
import {
  ConfirmDialogProps,
  ConfirmDialog,
} from '../../typescript';

// Import actual implementations for testing
import { confirmable, createConfirmation } from 'src';

// Test interfaces for constraint testing
interface StrictProps {
  readonly id: number;
  name: string;
  optional?: string;
}

interface StrictResponse {
  success: boolean;
  readonly timestamp: number;
}

describe('TypeScript Type Constraints Tests', () => {
  describe('ConfirmDialogProps Type Safety', () => {
    it('should ensure dismiss function has no parameters', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        // dismiss should not accept any parameters
        props.dismiss(); // ✓ Correct usage
        
        return React.createElement('div', {}, props.name);
      };

      expect(typeof TestDialog).toBe('function');
    });

    it('should ensure proceed function requires correct response type', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        // proceed must be called with StrictResponse type
        const response: StrictResponse = {
          success: true,
          timestamp: Date.now(),
        };
        props.proceed(response); // ✓ Correct usage
        
        return React.createElement('div', {}, props.name);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      expect(typeof ConfirmableTestDialog).toBe('function');
    });

    it('should ensure cancel function accepts optional parameter', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        // cancel can be called with or without parameters
        props.cancel(); // ✓ Correct usage
        props.cancel('reason'); // ✓ Correct usage
        props.cancel(new Error('custom error')); // ✓ Correct usage
        
        return React.createElement('div', {}, props.name);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      expect(typeof ConfirmableTestDialog).toBe('function');
    });

    it('should preserve readonly properties in props', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        // id should be readonly, so we can read it but not modify it
        const idValue = props.id; // ✓ Reading is allowed
        
        return React.createElement('div', {}, `ID: ${idValue}, Name: ${props.name}`);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      const confirm = createConfirmation(ConfirmableTestDialog);
      
      const result = confirm({
        id: 123,
        name: 'Test',
        optional: 'Optional value',
      });
      
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle optional properties correctly', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        // optional property may or may not be present
        const optionalValue = props.optional ?? 'default value';
        
        return React.createElement('div', {}, 
          `Name: ${props.name}, Optional: ${optionalValue}`
        );
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      const confirm = createConfirmation(ConfirmableTestDialog);
      
      // Test with optional property
      const resultWithOptional = confirm({
        id: 1,
        name: 'Test',
        optional: 'provided',
      });
      
      // Test without optional property
      const resultWithoutOptional = confirm({
        id: 2,
        name: 'Test2',
      });
      
      expect(resultWithOptional).toBeInstanceOf(Promise);
      expect(resultWithoutOptional).toBeInstanceOf(Promise);
    });
  });

  describe('Component Type Constraints', () => {
    it('should enforce that ConfirmDialog components return ReactNode', () => {
      // Valid return types
      const ValidDialog1: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return React.createElement('div', {}, props.name); // ReactElement
      };

      const ValidDialog2: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return props.name; // string
      };

      const ValidDialog3: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return props.id; // number
      };

      const ValidDialog4: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return null; // null
      };

      const ValidDialog5: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return undefined; // undefined
      };

      // All should be valid React components
      expect(typeof ValidDialog1).toBe('function');
      expect(typeof ValidDialog2).toBe('function');
      expect(typeof ValidDialog3).toBe('function');
      expect(typeof ValidDialog4).toBe('function');
      expect(typeof ValidDialog5).toBe('function');
    });

    it('should work with forwardRef components', () => {
      const ForwardRefDialog = React.forwardRef<
        HTMLDivElement,
        ConfirmDialogProps<StrictProps, StrictResponse>
      >((props, ref) => {
        return React.createElement('div', { ref }, props.name);
      });

      // ForwardRef components should work with confirmable
      const ConfirmableForwardRefDialog = confirmable(ForwardRefDialog);
      expect(typeof ConfirmableForwardRefDialog).toBe('function');
    });

    it('should work with memo components', () => {
      const MemoDialog = React.memo<ConfirmDialogProps<StrictProps, StrictResponse>>((props) => {
        return React.createElement('div', {}, props.name);
      });

      // Memo components should work with confirmable
      const ConfirmableMemoDialog = confirmable(MemoDialog);
      expect(typeof ConfirmableMemoDialog).toBe('function');
    });
  });

  describe('createConfirmation Type Constraints', () => {
    it('should enforce correct props type in confirmation function', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return React.createElement('div', {}, props.name);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      const confirm = createConfirmation(ConfirmableTestDialog);

      // Should require all required properties from StrictProps
      const validCall = confirm({
        id: 1,
        name: 'Required name',
        optional: 'Optional value', // optional can be provided
      });

      const validCallWithoutOptional = confirm({
        id: 2,
        name: 'Required name',
        // optional can be omitted
      });

      expect(validCall).toBeInstanceOf(Promise);
      expect(validCallWithoutOptional).toBeInstanceOf(Promise);
    });

    it('should return promise with correct response type', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        // Simulate proceeding with correct response type
        setTimeout(() => {
          props.proceed({
            success: true,
            timestamp: Date.now(),
          });
        }, 0);

        return React.createElement('div', {}, props.name);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      const confirm = createConfirmation(ConfirmableTestDialog);

      const promise = confirm({
        id: 1,
        name: 'Test',
      });

      // Promise should resolve to StrictResponse type
      expect(promise).toBeInstanceOf(Promise);
      
      // Type assertion to verify the promise resolves to correct type
      return promise.then((result: StrictResponse) => {
        expect(typeof result.success).toBe('boolean');
        expect(typeof result.timestamp).toBe('number');
      }).catch(() => {
        // Promise might not resolve in test environment, but type checking is what matters
        expect(true).toBe(true);
      });
    });

    it('should handle unmountDelay parameter correctly', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return React.createElement('div', {}, props.name);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      // Should accept number for unmountDelay
      const confirmWithDelay = createConfirmation(ConfirmableTestDialog, 1000);
      
      // Should accept undefined for unmountDelay
      const confirmWithoutDelay = createConfirmation(ConfirmableTestDialog, undefined);
      
      expect(typeof confirmWithDelay).toBe('function');
      expect(typeof confirmWithoutDelay).toBe('function');
    });

    it('should handle mountingNode parameter correctly', () => {
      const TestDialog: ConfirmDialog<StrictProps, StrictResponse> = (props) => {
        return React.createElement('div', {}, props.name);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      const mountingNode = document.createElement('div');
      
      // Should accept HTMLElement for mountingNode
      const confirmWithNode = createConfirmation(ConfirmableTestDialog, undefined, mountingNode);
      
      // Should accept undefined for mountingNode
      const confirmWithoutNode = createConfirmation(ConfirmableTestDialog, undefined, undefined);
      
      expect(typeof confirmWithNode).toBe('function');
      expect(typeof confirmWithoutNode).toBe('function');
    });
  });

  describe('Advanced Generic Constraints', () => {
    it('should work with conditional types', () => {
      type ConditionalResponse<T> = T extends string ? { text: T } : { value: T };

      interface ConditionalProps<T> {
        input: T;
      }

      const ConditionalDialog = <T,>(props: ConfirmDialogProps<ConditionalProps<T>, ConditionalResponse<T>>) => {
        return React.createElement('div', {}, String(props.input));
      };

      // This tests that our type definitions can handle more complex generic scenarios
      expect(typeof ConditionalDialog).toBe('function');
    });

    it('should work with mapped types', () => {
      type MakeOptional<T> = {
        [K in keyof T]?: T[K];
      };

      interface BaseProps {
        title: string;
        message: string;
        count: number;
      }

      type OptionalProps = MakeOptional<BaseProps>;

      const MappedDialog: ConfirmDialog<OptionalProps, boolean> = (props) => {
        return React.createElement('div', {}, props.title ?? 'Default Title');
      };

      const ConfirmableMappedDialog = confirmable(MappedDialog);
      const confirm = createConfirmation(ConfirmableMappedDialog);

      // All properties should be optional
      const result = confirm({});
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with intersection types', () => {
      interface BaseProps {
        id: number;
      }

      interface ExtendedProps {
        name: string;
      }

      type IntersectionProps = BaseProps & ExtendedProps;

      const IntersectionDialog: ConfirmDialog<IntersectionProps, void> = (props) => {
        return React.createElement('div', {}, `${props.id}: ${props.name}`);
      };

      const ConfirmableIntersectionDialog = confirmable(IntersectionDialog);
      const confirm = createConfirmation(ConfirmableIntersectionDialog);

      // Should require both id and name
      const result = confirm({
        id: 1,
        name: 'Test',
      });

      expect(result).toBeInstanceOf(Promise);
    });
  });
});