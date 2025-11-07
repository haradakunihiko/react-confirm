import * as React from 'react';
import { confirmable, createConfirmation, abort, abortAll } from 'src';

describe('Cancellation (abort) behavior', () => {
  // Dialog that doesn't auto-resolve (waits until manually aborted)
  const HangingDialog = ({ show }: any) => (show ? React.createElement('div', { 'data-testid': 'hanging' }) : null);
  const ConfirmableHanging = confirmable(HangingDialog);

  it('abort(promise) rejects with AbortError and unmounts', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Verify Promise is still pending
    const res = await Promise.race([
      p.then(() => ({ status: 'fulfilled' })).catch((e) => ({ status: 'rejected', error: e })),
      new Promise((resolve) => setTimeout(resolve, 0)).then(() => 'tick'),
    ]);
    expect(res).toBe('tick');

    // Execute abort
    abort(p);

    // Verify it rejects with AbortError
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('abortAll() rejects all pending promises', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});

    // Abort all
    abortAll();

    const [r1, r2] = await Promise.allSettled([p1, p2]);
    expect(r1.status).toBe('rejected');
    expect(r2.status).toBe('rejected');
    expect(r1).toMatchObject({ reason: expect.objectContaining({ name: 'AbortError' }) });
    expect(r2).toMatchObject({ reason: expect.objectContaining({ name: 'AbortError' }) });
  });

  it('supports AbortSignal via options param', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const ac = new AbortController();
    const p = confirm({}, { signal: ac.signal });

    ac.abort();

    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('abort returns false for already settled promise', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Abort first
    const result = abort(p);
    expect(result).toBe(true);

    // Try to abort again after settlement
    await p.catch(() => {});
    const result2 = abort(p);
    expect(result2).toBe(false);
  });

  it('handles already aborted signal', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const ac = new AbortController();
    ac.abort();

    const p = confirm({}, { signal: ac.signal });

    // Should reject immediately since signal is already aborted
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('multiple dialogs can be aborted independently', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});
    const p3 = confirm({});

    // Abort only p2
    abort(p2);

    // p2 is aborted but p1 and p3 are still pending
    const r2 = await p2.catch((e) => e);
    expect(r2).toMatchObject({ name: 'AbortError' });

    // Verify p1 and p3 are still pending
    const res1 = await Promise.race([
      p1.then(() => 'resolved').catch(() => 'rejected'),
      new Promise((resolve) => setTimeout(() => resolve('pending'), 10)),
    ]);
    expect(res1).toBe('pending');

    // Cleanup p1 and p3
    abort(p1);
    abort(p3);
  });

  it('custom abort reason is propagated', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    const customError = new Error('Custom abort reason');
    abort(p, customError);

    await expect(p).rejects.toBe(customError);
  });
});
