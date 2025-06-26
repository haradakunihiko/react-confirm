import * as React from 'react';
import {
  ConfirmDialogProps,
  ConfirmDialog,
} from '../../typescript/index';

// Import actual implementations for testing
import confirmable from '../../src/confirmable';
import createConfirmation, { createConfirmationCreater } from '../../src/createConfirmation';
import { createReactTreeMounter, createMountPoint } from '../../src/mounter/reactTree';
import { createDomTreeMounter } from '../../src/mounter/domTree';

// Test types for ConfirmDialogProps
interface TestProps {
  title: string;
  message: string;
  count?: number;
}

interface TestResponse {
  result: boolean;
  data?: string;
}

describe('TypeScript Type Tests', () => {
  describe('ConfirmDialogProps', () => {
    it('should have correct properties', () => {
      const props: ConfirmDialogProps<TestProps, TestResponse> = {
        // Required ConfirmDialogProps properties
        dismiss: () => {},
        proceed: (value: TestResponse) => {},
        cancel: (value?: any) => {},
        show: true,
        // Custom properties from TestProps
        title: 'Test Title',
        message: 'Test Message',
        count: 42,
      };

      expect(props.dismiss).toBeInstanceOf(Function);
      expect(props.proceed).toBeInstanceOf(Function);
      expect(props.cancel).toBeInstanceOf(Function);
      expect(props.show).toBe(true);
      expect(props.title).toBe('Test Title');
      expect(props.message).toBe('Test Message');
      expect(props.count).toBe(42);
    });

    it('should allow optional properties to be undefined', () => {
      const props: ConfirmDialogProps<TestProps, TestResponse> = {
        dismiss: () => {},
        proceed: (value: TestResponse) => {},
        cancel: (value?: any) => {},
        show: false,
        title: 'Test Title',
        message: 'Test Message',
        // count is optional, so it can be omitted
      };

      expect(props.count).toBeUndefined();
    });

    it('should enforce correct proceed parameter type', () => {
      const mockProceed = jest.fn();
      const props: ConfirmDialogProps<TestProps, TestResponse> = {
        dismiss: () => {},
        proceed: mockProceed,
        cancel: () => {},
        show: true,
        title: 'Test',
        message: 'Test',
      };

      const response: TestResponse = { result: true, data: 'test' };
      props.proceed(response);

      expect(mockProceed).toHaveBeenCalledWith(response);
    });
  });

  describe('ConfirmDialog', () => {
    it('should be a valid React component type', () => {
      const TestDialog: ConfirmDialog<TestProps, TestResponse> = (props) => {
        return React.createElement('div', {}, 
          `${props.title}: ${props.message}`
        );
      };

      expect(typeof TestDialog).toBe('function');
    });

    it('should work with React.FC type annotation', () => {
      const TestDialog: React.FC<ConfirmDialogProps<TestProps, TestResponse>> = (props) => {
        return React.createElement('div', {}, 
          `${props.title}: ${props.message}`
        );
      };

      expect(typeof TestDialog).toBe('function');
    });
  });

  describe('confirmable', () => {
    it('should accept a ConfirmDialog and return a ConfirmableDialog', () => {
      const TestDialog: ConfirmDialog<TestProps, TestResponse> = (props) => {
        return React.createElement('div', {}, props.title);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      expect(typeof ConfirmableTestDialog).toBe('function');
    });

    it('should preserve generic types through confirmable HOC', () => {
      const TestDialog: ConfirmDialog<TestProps, TestResponse> = (props) => {
        // Test that all required props are available
        props.dismiss();
        props.proceed({ result: true });
        props.cancel();
        return React.createElement('div', {}, 
          `${props.title}: ${props.message}`
        );
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      // Test that the confirmable component can be used with the expected props
      const mockProps = {
        dispose: () => {},
        resolve: Promise.resolve({ result: true }),
        reject: (reason?: any) => {},
        title: 'Test',
        message: 'Test Message',
      };

      expect(() => {
        React.createElement(ConfirmableTestDialog, mockProps);
      }).not.toThrow();
    });
  });

  describe('createConfirmation', () => {
    it('should create a confirmation function with correct signature', () => {
      const TestDialog: ConfirmDialog<TestProps, TestResponse> = (props) => {
        return React.createElement('div', {}, props.title);
      };
      
      const ConfirmableTestDialog = confirmable(TestDialog);
      const confirm = createConfirmation(ConfirmableTestDialog);

      expect(typeof confirm).toBe('function');

      // Test that the confirmation function returns a Promise
      const result = confirm({ title: 'Test', message: 'Test Message' });
      expect(result).toBeInstanceOf(Promise);
    });

    it('should accept optional unmountDelay parameter', () => {
      const TestDialog: ConfirmDialog<TestProps, TestResponse> = (props) => {
        return React.createElement('div', {}, props.title);
      };
      
      const ConfirmableTestDialog = confirmable(TestDialog);
      const confirm = createConfirmation(ConfirmableTestDialog, 1000);

      expect(typeof confirm).toBe('function');
    });

    it('should accept optional mountingNode parameter', () => {
      const TestDialog: ConfirmDialog<TestProps, TestResponse> = (props) => {
        return React.createElement('div', {}, props.title);
      };
      
      const ConfirmableTestDialog = confirmable(TestDialog);
      const mountingNode = document.createElement('div');
      const confirm = createConfirmation(ConfirmableTestDialog, undefined, mountingNode);

      expect(typeof confirm).toBe('function');
    });
  });

  describe('Mounter Types', () => {
    it('should create DOM tree mounter correctly', () => {
      const mounter = createDomTreeMounter();
      
      expect(typeof mounter.mount).toBe('function');
      expect(typeof mounter.unmount).toBe('function');
    });

    it('should create DOM tree mounter with custom mount node', () => {
      const mountNode = document.createElement('div');
      const mounter = createDomTreeMounter(mountNode);
      
      expect(typeof mounter.mount).toBe('function');
      expect(typeof mounter.unmount).toBe('function');
    });

    it('should create React tree mounter correctly', () => {
      const treeMounter = createReactTreeMounter();
      
      expect(typeof treeMounter.mount).toBe('function');
      expect(typeof treeMounter.unmount).toBe('function');
      expect(typeof treeMounter.options).toBe('object');
      expect(typeof treeMounter.options.setMountedCallback).toBe('function');
    });

    it('should create React tree mounter with custom mount node', () => {
      const mountNode = document.createElement('div');
      const treeMounter = createReactTreeMounter(mountNode);
      
      expect(typeof treeMounter.mount).toBe('function');
      expect(typeof treeMounter.unmount).toBe('function');
      expect(typeof treeMounter.options).toBe('object');
    });

    it('should create mount point component', () => {
      const treeMounter = createReactTreeMounter();
      const MountPoint = createMountPoint(treeMounter);
      
      expect(typeof MountPoint).toBe('function');
    });

    it('should create confirmation creator with mounter', () => {
      const mounter = createDomTreeMounter();
      const createConfirmationWithMounter = createConfirmationCreater(mounter);
      
      expect(typeof createConfirmationWithMounter).toBe('function');
    });
  });

  describe('Generic Type Constraints', () => {
    it('should work with simple types', () => {
      interface SimpleProps {
        value: string;
      }
      
      type SimpleResponse = string;

      const SimpleDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        return React.createElement('div', {}, props.value);
      };

      const ConfirmableSimpleDialog = confirmable(SimpleDialog);
      const confirm = createConfirmation(ConfirmableSimpleDialog);
      
      const result = confirm({ value: 'test' });
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with complex nested types', () => {
      interface ComplexProps {
        data: {
          nested: {
            value: number;
            optional?: boolean;
          };
        };
        callback: (arg: string) => void;
      }
      
      interface ComplexResponse {
        status: 'success' | 'error';
        payload: {
          id: number;
          metadata?: Record<string, any>;
        };
      }

      const ComplexDialog: ConfirmDialog<ComplexProps, ComplexResponse> = (props) => {
        return React.createElement('div', {}, props.data.nested.value.toString());
      };

      const ConfirmableComplexDialog = confirmable(ComplexDialog);
      const confirm = createConfirmation(ConfirmableComplexDialog);
      
      const result = confirm({
        data: {
          nested: {
            value: 42,
            optional: true,
          }
        },
        callback: (arg: string) => {},
      });
      
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with union types', () => {
      interface UnionProps {
        mode: 'edit' | 'view' | 'delete';
        data: string | number | boolean;
      }
      
      type UnionResponse = { success: true; value: string } | { success: false; error: string };

      const UnionDialog: ConfirmDialog<UnionProps, UnionResponse> = (props) => {
        return React.createElement('div', {}, props.mode);
      };

      const ConfirmableUnionDialog = confirmable(UnionDialog);
      const confirm = createConfirmation(ConfirmableUnionDialog);
      
      const result = confirm({
        mode: 'edit',
        data: 'test',
      });
      
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with no props (empty object)', () => {
      type EmptyProps = {};
      type SimpleResponse = boolean;

      const EmptyPropsDialog: ConfirmDialog<EmptyProps, SimpleResponse> = (props) => {
        return React.createElement('div', {}, 'No props dialog');
      };

      const ConfirmableEmptyPropsDialog = confirmable(EmptyPropsDialog);
      const confirm = createConfirmation(ConfirmableEmptyPropsDialog);
      
      const result = confirm({});
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with void response type', () => {
      interface VoidResponseProps {
        message: string;
      }
      
      type VoidResponse = void;

      const VoidResponseDialog: ConfirmDialog<VoidResponseProps, VoidResponse> = (props) => {
        return React.createElement('div', {}, props.message);
      };

      const ConfirmableVoidResponseDialog = confirmable(VoidResponseDialog);
      const confirm = createConfirmation(ConfirmableVoidResponseDialog);
      
      const result = confirm({ message: 'test' });
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('Type Inference', () => {
    it('should infer types correctly from component definition', () => {
      // Define a dialog without explicit generic parameters
      const InferredDialog = (props: ConfirmDialogProps<{ title: string }, boolean>) => {
        return React.createElement('div', {}, props.title);
      };

      const ConfirmableInferredDialog = confirmable(InferredDialog);
      const confirm = createConfirmation(ConfirmableInferredDialog);

      // TypeScript should infer the correct parameter and return types
      const result = confirm({ title: 'Inferred' });
      expect(result).toBeInstanceOf(Promise);
    });
  });
});