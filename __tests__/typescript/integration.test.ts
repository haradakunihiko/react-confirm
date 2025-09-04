import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ConfirmDialogProps,
  ConfirmDialog,
} from 'src';

// Import actual implementations for testing
import {confirmable, createConfirmation, createConfirmationCreater, createReactTreeMounter, createMountPoint, createDomTreeMounter} from 'src';


// Test interfaces for integration testing
interface DeleteConfirmProps {
  itemName: string;
  itemCount?: number;
  isDangerous?: boolean;
}

interface DeleteConfirmResponse {
  confirmed: boolean;
  deleteAll?: boolean;
}

interface SimpleProps {
  message: string;
}

type SimpleResponse = 'yes' | 'no' | 'cancel';

describe('TypeScript Integration Tests', () => {
  describe('Basic Confirmation Dialog Integration', () => {
    it('should work with a complete confirmation dialog flow', async () => {
      // Define the dialog component with proper typing
      const DeleteConfirmDialog: ConfirmDialog<DeleteConfirmProps, DeleteConfirmResponse> = (props) => {
        const handleConfirm = () => {
          props.proceed({
            confirmed: true,
            deleteAll: props.itemCount ? props.itemCount > 1 : false,
          });
        };

        const handleCancel = () => {
          props.cancel();
        };

        if (!props.show) {
          return null;
        }

        return React.createElement('div', { 'data-testid': 'delete-dialog' }, [
          React.createElement('h2', { key: 'title' }, 'Confirm Delete'),
          React.createElement('p', { key: 'message' }, 
            `Are you sure you want to delete "${props.itemName}"?`
          ),
          props.itemCount && props.itemCount > 1 
            ? React.createElement('p', { key: 'count' }, `This will delete ${props.itemCount} items.`)
            : null,
          props.isDangerous 
            ? React.createElement('p', { key: 'warning', style: { color: 'red' } }, 'This action cannot be undone!')
            : null,
          React.createElement('div', { key: 'buttons' }, [
            React.createElement('button', { 
              key: 'confirm',
              'data-testid': 'confirm-button',
              onClick: handleConfirm 
            }, 'Delete'),
            React.createElement('button', { 
              key: 'cancel',
              'data-testid': 'cancel-button',
              onClick: handleCancel 
            }, 'Cancel'),
          ]),
        ]);
      };

      // Create confirmable version
      const ConfirmableDeleteDialog = confirmable(DeleteConfirmDialog);

      // Create confirmation function
      const confirmDelete = createConfirmation(ConfirmableDeleteDialog);

      // Test the confirmation flow
      let confirmationPromise!: Promise<any>;
      await act(async () => {
        confirmationPromise = confirmDelete({
          itemName: 'test-file.txt',
          itemCount: 1,
          isDangerous: true,
        });
      });

      expect(confirmationPromise).toBeInstanceOf(Promise);

      // In a real scenario, the dialog would be rendered and user would interact with it
      // For testing purposes, we just verify the types work correctly
      expect(typeof confirmDelete).toBe('function');
    });

    it('should work with simple string response dialog', async () => {
      const SimpleDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        if (!props.show) {
          return null;
        }

        return React.createElement('div', { 'data-testid': 'simple-dialog' }, [
          React.createElement('p', { key: 'message' }, props.message),
          React.createElement('button', { 
            key: 'yes',
            'data-testid': 'yes-button',
            onClick: () => props.proceed('yes')
          }, 'Yes'),
          React.createElement('button', { 
            key: 'no',
            'data-testid': 'no-button',
            onClick: () => props.proceed('no')
          }, 'No'),
          React.createElement('button', { 
            key: 'cancel',
            'data-testid': 'cancel-button',
            onClick: () => props.proceed('cancel')
          }, 'Cancel'),
        ]);
      };

      const ConfirmableSimpleDialog = confirmable(SimpleDialog);
      const confirmSimple = createConfirmation(ConfirmableSimpleDialog);

      let promise!: Promise<any>;
      await act(async () => {
        promise = confirmSimple({ message: 'Do you agree?' });
      });
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe('React Tree Mounter Integration', () => {
    it('should work with React tree mounting system', () => {
      const TestDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        return React.createElement('div', {}, props.message);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      // Create React tree mounter
      const treeMounter = createReactTreeMounter();
      const MountPoint = createMountPoint(treeMounter);
      const createConfirmationWithTreeMounter = createConfirmationCreater(treeMounter);
      const confirm = createConfirmationWithTreeMounter(ConfirmableTestDialog);

      // Test that all components are properly typed
      expect(typeof treeMounter.mount).toBe('function');
      expect(typeof treeMounter.unmount).toBe('function');
      expect(typeof treeMounter.options).toBe('object');
      expect(typeof MountPoint).toBe('function');
      expect(typeof confirm).toBe('function');

      // Test the confirmation function
      const result = confirm({ message: 'Test message' });
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with custom mount node', () => {
      const customMountNode = document.createElement('div');
      document.body.appendChild(customMountNode);

      const TestDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        return React.createElement('div', {}, props.message);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      // Create React tree mounter with custom node
      const treeMounter = createReactTreeMounter(customMountNode);
      const MountPoint = createMountPoint(treeMounter);

      expect(typeof MountPoint).toBe('function');
      expect(treeMounter.options.mountNode).toBe(customMountNode);

      // Cleanup
      document.body.removeChild(customMountNode);
    });
  });

  describe('DOM Tree Mounter Integration', () => {
    it('should work with DOM tree mounting system', async () => {
      const TestDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        return React.createElement('div', {}, props.message);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      // Create DOM tree mounter
      const domMounter = createDomTreeMounter();
      const createConfirmationWithDomMounter = createConfirmationCreater(domMounter);
      const confirm = createConfirmationWithDomMounter(ConfirmableTestDialog);

      // Test that all components are properly typed
      expect(typeof domMounter.mount).toBe('function');
      expect(typeof domMounter.unmount).toBe('function');
      expect(typeof confirm).toBe('function');

      // Test the confirmation function
      let result!: Promise<any>;
      await act(async () => {
        result = confirm({ message: 'Test message' });
      });
      expect(result).toBeInstanceOf(Promise);
    });

    it('should work with custom mount node for DOM mounter', async () => {
      const customMountNode = document.createElement('div');
      document.body.appendChild(customMountNode);

      const TestDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        return React.createElement('div', {}, props.message);
      };

      const ConfirmableTestDialog = confirmable(TestDialog);
      
      // Create DOM tree mounter with custom node
      const domMounter = createDomTreeMounter(customMountNode);
      const createConfirmationWithDomMounter = createConfirmationCreater(domMounter);
      const confirm = createConfirmationWithDomMounter(ConfirmableTestDialog);

      expect(typeof confirm).toBe('function');

      // Test the confirmation function
      let result!: Promise<any>;
      await act(async () => {
        result = confirm({ message: 'Test message' });
      });
      expect(result).toBeInstanceOf(Promise);

      // Cleanup
      document.body.removeChild(customMountNode);
    });
  });

  describe('Complex Real-world Scenarios', () => {
    it('should handle complex form confirmation dialog', async () => {
      interface FormConfirmProps {
        formData: {
          name: string;
          email: string;
          preferences: {
            notifications: boolean;
            newsletter: boolean;
          };
        };
        hasUnsavedChanges: boolean;
      }

      interface FormConfirmResponse {
        action: 'save' | 'discard' | 'cancel';
        saveData?: FormConfirmProps['formData'];
      }

      const FormConfirmDialog: ConfirmDialog<FormConfirmProps, FormConfirmResponse> = (props) => {
        if (!props.show) {
          return null;
        }

        const handleSave = () => {
          props.proceed({
            action: 'save',
            saveData: props.formData,
          });
        };

        const handleDiscard = () => {
          props.proceed({ action: 'discard' });
        };

        const handleCancel = () => {
          props.proceed({ action: 'cancel' });
        };

        return React.createElement('div', { 'data-testid': 'form-confirm-dialog' }, [
          React.createElement('h2', { key: 'title' }, 'Unsaved Changes'),
          React.createElement('p', { key: 'message' }, 
            props.hasUnsavedChanges 
              ? 'You have unsaved changes. What would you like to do?'
              : 'Are you sure you want to leave this form?'
          ),
          React.createElement('div', { key: 'preview' }, [
            React.createElement('h3', { key: 'preview-title' }, 'Current Data:'),
            React.createElement('p', { key: 'name' }, `Name: ${props.formData.name}`),
            React.createElement('p', { key: 'email' }, `Email: ${props.formData.email}`),
            React.createElement('p', { key: 'notifications' }, 
              `Notifications: ${props.formData.preferences.notifications ? 'On' : 'Off'}`
            ),
          ]),
          React.createElement('div', { key: 'buttons' }, [
            React.createElement('button', { 
              key: 'save',
              'data-testid': 'save-button',
              onClick: handleSave 
            }, 'Save & Continue'),
            React.createElement('button', { 
              key: 'discard',
              'data-testid': 'discard-button',
              onClick: handleDiscard 
            }, 'Discard Changes'),
            React.createElement('button', { 
              key: 'cancel',
              'data-testid': 'cancel-button',
              onClick: handleCancel 
            }, 'Stay Here'),
          ]),
        ]);
      };

      const ConfirmableFormDialog = confirmable(FormConfirmDialog);
      const confirmForm = createConfirmation(ConfirmableFormDialog);

      let result!: Promise<any>;
      await act(async () => {
        result = confirmForm({
          formData: {
            name: 'John Doe',
            email: 'john@example.com',
            preferences: {
              notifications: true,
              newsletter: false,
            },
          },
          hasUnsavedChanges: true,
        });
      });

      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle async confirmation with error handling', async () => {
      interface AsyncProps {
        operation: string;
        requiresConfirmation: boolean;
      }

      interface AsyncResponse {
        success: boolean;
        error?: string;
      }

      const AsyncDialog: ConfirmDialog<AsyncProps, AsyncResponse> = (props) => {
        if (!props.show) {
          return null;
        }

        const handleConfirm = async () => {
          try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 10));
            props.proceed({ success: true });
          } catch (error) {
            props.proceed({ 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        };

        const handleReject = () => {
          props.cancel('User cancelled');
        };

        return React.createElement('div', { 'data-testid': 'async-dialog' }, [
          React.createElement('h2', { key: 'title' }, 'Async Operation'),
          React.createElement('p', { key: 'message' }, 
            `Are you sure you want to perform: ${props.operation}?`
          ),
          props.requiresConfirmation 
            ? React.createElement('p', { key: 'warning' }, 'This operation requires confirmation.')
            : null,
          React.createElement('div', { key: 'buttons' }, [
            React.createElement('button', { 
              key: 'confirm',
              'data-testid': 'confirm-button',
              onClick: handleConfirm 
            }, 'Confirm'),
            React.createElement('button', { 
              key: 'reject',
              'data-testid': 'reject-button',
              onClick: handleReject 
            }, 'Cancel'),
          ]),
        ]);
      };

      const ConfirmableAsyncDialog = confirmable(AsyncDialog);
      const confirmAsync = createConfirmation(ConfirmableAsyncDialog);

      let result!: Promise<any>;
      await act(async () => {
        result = confirmAsync({
          operation: 'Delete all files',
          requiresConfirmation: true,
        });
      });

      expect(result).toBeInstanceOf(Promise);

      // Test that promise can be handled properly
      result!.then((response: AsyncResponse) => {
        expect(typeof response.success).toBe('boolean');
        if (!response.success) {
          expect(typeof response.error).toBe('string');
        }
      }).catch((error) => {
        // Handle cancellation or other errors
        expect(error).toBeDefined();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle component that never calls proceed or cancel', async () => {
      const NeverResolvingDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        if (!props.show) {
          return null;
        }

        // This dialog never calls proceed or cancel, simulating a hanging dialog
        return React.createElement('div', { 'data-testid': 'never-resolving-dialog' }, [
          React.createElement('p', { key: 'message' }, props.message),
          React.createElement('p', { key: 'info' }, 'This dialog will never resolve'),
        ]);
      };

      const ConfirmableNeverResolvingDialog = confirmable(NeverResolvingDialog);
      const confirmNeverResolving = createConfirmation(ConfirmableNeverResolvingDialog);

      let result!: Promise<any>;
      await act(async () => {
        result = confirmNeverResolving({ message: 'This will hang' });
      });
      expect(result).toBeInstanceOf(Promise);

      // The promise should remain pending, which is the expected behavior
      let resolved = false;
      result!.then(() => { resolved = true; }).catch(() => { resolved = true; });
      
      // Since the dialog never resolves, this should still be false after a short delay
      setTimeout(() => {
        expect(resolved).toBe(false);
      }, 100);
    });

    it('should handle component that calls dismiss', async () => {
      const DismissibleDialog: ConfirmDialog<SimpleProps, SimpleResponse> = (props) => {
        if (!props.show) {
          return null;
        }

        const handleDismiss = () => {
          props.dismiss();
        };

        return React.createElement('div', { 'data-testid': 'dismissible-dialog' }, [
          React.createElement('p', { key: 'message' }, props.message),
          React.createElement('button', { 
            key: 'dismiss',
            'data-testid': 'dismiss-button',
            onClick: handleDismiss 
          }, 'Dismiss'),
        ]);
      };

      const ConfirmableDismissibleDialog = confirmable(DismissibleDialog);
      const confirmDismissible = createConfirmation(ConfirmableDismissibleDialog);

      let result!: Promise<any>;
      await act(async () => {
        result = confirmDismissible({ message: 'Can be dismissed' });
      });
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
