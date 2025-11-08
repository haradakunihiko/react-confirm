import * as React from 'react';
import { confirmable, createConfirmation, close, closeAll } from 'src';

describe('Close (external completion) behavior', () => {
  // Dialog that doesn't auto-resolve (waits until manually closed)
  const HangingDialog = ({ show }: any) => (show ? React.createElement('div', { 'data-testid': 'hanging' }) : null);
  const ConfirmableHanging = confirmable(HangingDialog);

  it('close(promise, response) resolves with response value', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Verify Promise is still pending
    const res = await Promise.race([
      p.then(() => ({ status: 'fulfilled' })).catch((e) => ({ status: 'rejected', error: e })),
      new Promise((resolve) => setTimeout(resolve, 0)).then(() => 'tick'),
    ]);
    expect(res).toBe('tick');

    // Close with response value
    close(p, false);

    // Verify it resolves with the provided value
    await expect(p).resolves.toBe(false);
  });

  it('closeAll() resolves all pending promises with response value', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});

    // Close all with false
    closeAll(false);

    const [r1, r2] = await Promise.allSettled([p1, p2]);
    expect(r1.status).toBe('fulfilled');
    expect(r2.status).toBe('fulfilled');
    expect(r1).toMatchObject({ value: false });
    expect(r2).toMatchObject({ value: false });
  });

  it('supports AbortSignal via options param with abortResponse', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const ac = new AbortController();
    const p = confirm({}, { signal: ac.signal, abortResponse: false });

    ac.abort();

    await expect(p).resolves.toBe(false);
  });

  it('close returns false for already settled promise', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Close first
    const result = close(p, false);
    expect(result).toBe(true);

    // Try to close again after settlement
    await p;
    const result2 = close(p, false);
    expect(result2).toBe(false);
  });

  it('handles already aborted signal', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const ac = new AbortController();
    ac.abort();

    const p = confirm({}, { signal: ac.signal, abortResponse: false });

    // Should resolve immediately since signal is already aborted
    await expect(p).resolves.toBe(false);
  });

  it('multiple dialogs can be closed independently', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});
    const p3 = confirm({});

    // Close only p2
    close(p2, false);

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
    close(p1, false);
    close(p3, false);
  });

  it('response value is type-safe', async () => {
    type CustomResponse = 'yes' | 'no' | 'cancel';
    const CustomDialog = ({ show }: any) => (show ? React.createElement('div') : null);
    const ConfirmableCustom = confirmable<{}, CustomResponse>(CustomDialog);
    const confirm = createConfirmation(ConfirmableCustom);

    const p = confirm({});

    // TypeScript should ensure response matches the Promise type
    close(p, 'cancel');

    await expect(p).resolves.toBe('cancel');
  });
});
