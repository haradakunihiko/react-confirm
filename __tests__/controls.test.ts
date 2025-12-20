import * as React from 'react';
import { confirmable, createConfirmation, proceed, dismiss, cancel } from 'src';

describe('External control behavior', () => {
  // Dialog that doesn't auto-resolve (waits until manually closed)
  const HangingDialog = ({ show }: any) => (show ? React.createElement('div', { 'data-testid': 'hanging' }) : null);
  const ConfirmableHanging = confirmable(HangingDialog);

  it('proceed(promise, response) resolves with response value', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Verify Promise is still pending
    const res = await Promise.race([
      p.then(() => ({ status: 'fulfilled' })).catch((e) => ({ status: 'rejected', error: e })),
      new Promise((resolve) => setTimeout(resolve, 0)).then(() => 'tick'),
    ]);
    expect(res).toBe('tick');

    // Resolve with proceed
    proceed(p, false);

    // Verify it resolves with the provided value
    await expect(p).resolves.toBe(false);
  });

  it('dismiss(promise) closes dialog without resolving promise', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Close UI with dismiss (Promise remains pending)
    const result = dismiss(p);
    expect(result).toBe(true);

    // Promise is still pending
    const res = await Promise.race([
      p.then(() => 'resolved').catch(() => 'rejected'),
      new Promise((resolve) => setTimeout(() => resolve('pending'), 50)),
    ]);
    expect(res).toBe('pending');
  });

  it('cancel(promise, reason) rejects with reason', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Reject with cancel
    cancel(p, new Error('User cancelled'));

    await expect(p).rejects.toThrow('User cancelled');
  });

  it('cancel(promise) rejects with undefined reason', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    cancel(p);

    await expect(p).rejects.toBeUndefined();
  });

  it('proceed returns false for already settled promise', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // First proceed
    const result = proceed(p, false);
    expect(result).toBe(true);

    // Proceed again after settlement should fail
    await p;
    const result2 = proceed(p, false);
    expect(result2).toBe(false);
  });

  it('dismiss returns false for already settled promise', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Resolve with proceed
    proceed(p, true);
    await p;

    // Dismiss after settlement should fail
    const result = dismiss(p);
    expect(result).toBe(false);
  });

  it('cancel returns false for already settled promise', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Resolve with proceed
    proceed(p, true);
    await p;

    // Cancel after settlement should fail
    const result = cancel(p, new Error('Too late'));
    expect(result).toBe(false);
  });

  it('multiple dialogs can be closed independently', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});
    const p3 = confirm({});

    // Proceed only p2
    proceed(p2, false);

    // p2 is closed but p1 and p3 are still pending
    const r2 = await p2;
    expect(r2).toBe(false);

    // Verify p1 and p3 are still pending
    const res1 = await Promise.race([
      p1.then(() => 'resolved').catch(() => 'rejected'),
      new Promise((resolve) => setTimeout(() => resolve('pending'), 10)),
    ]);
    expect(res1).toBe('pending');

    // Cleanup p1 and p3
    proceed(p1, false);
    proceed(p3, false);
  });

  it('response value is type-safe', async () => {
    type CustomResponse = 'yes' | 'no' | 'cancel';
    const CustomDialog = ({ show }: any) => (show ? React.createElement('div') : null);
    const ConfirmableCustom = confirmable<{}, CustomResponse>(CustomDialog);
    const confirm = createConfirmation(ConfirmableCustom);

    const p = confirm({});

    // TypeScript ensures response type matches Promise type
    proceed(p, 'cancel');

    await expect(p).resolves.toBe('cancel');
  });

  it('can use different control methods for different dialogs', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});
    const p3 = confirm({});

    // Use different control methods for each dialog
    proceed(p1, true);
    dismiss(p2);
    cancel(p3, new Error('Cancelled'));

    // p1 is resolved
    await expect(p1).resolves.toBe(true);

    // p2 is still pending
    const res2 = await Promise.race([
      p2.then(() => 'resolved').catch(() => 'rejected'),
      new Promise((resolve) => setTimeout(() => resolve('pending'), 10)),
    ]);
    expect(res2).toBe('pending');

    // p3 is rejected
    await expect(p3).rejects.toThrow('Cancelled');
  });
});
