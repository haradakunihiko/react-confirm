import 'regenerator-runtime/runtime';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import React from 'react';

import { createConfirmationCreater } from '../src/createConfirmation';
import { createDomTreeMounter } from '../src/mounter/domTree';

const MyComponent = ({ resolve, reject }) => (
  <div>
    <button onClick={() => resolve('success')}>Resolve</button>
    <button onClick={() => reject('error')}>Reject</button>
  </div>
);

describe('createConfirmationCreater', () => {
  const mounter = createDomTreeMounter();
  const spy = jest.spyOn(mounter, 'mount');
  const unmountSpy = jest.spyOn(mounter, 'unmount');
  const confirm = createConfirmationCreater(mounter);

  test('mounts and unmounts the component, and resolves the promise', async () => {
    const confirmMyComponent = confirm(MyComponent);

    let result;
    await act(async () => {
      result = confirmMyComponent();
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    const resolveButton = document.querySelector('button');
    await act(async () => {
      fireEvent.click(resolveButton);
    });

    await expect(result).resolves.toBe('success');

    await waitFor(() => {
      expect(unmountSpy).toHaveBeenCalled();
    });
  });

  test('mounts and unmounts the component, and rejects the promise', async () => {
    const confirmMyComponent = confirm(MyComponent);
  
    let result;
    await act(async () => {
      result = confirmMyComponent().catch((e) => e); // ここで.catchを追加してエラーを無視しないようにする
    });
  
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  
    const rejectButton = document.querySelectorAll('button')[1];
    await act(async () => {
      fireEvent.click(rejectButton);
    });
  
    const error = await result;
    expect(error).toBe('error');
  
    await waitFor(() => {
      expect(unmountSpy).toHaveBeenCalled();
    });
  });
  
});
