import * as React from 'react';
import { confirmable, createConfirmation, abort, abortAll } from 'src';

describe('Cancellation (abort) behavior', () => {
  const HangingDialog = ({ show }) => (show ? React.createElement('div', { 'data-testid': 'hanging' }) : null);
  const ConfirmableHanging = confirmable(HangingDialog);

  it('abort(promise) rejects with AbortError and unmounts', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    const res = await Promise.race([
      p.then(() => ({ status: 'fulfilled' })).catch((e) => ({ status: 'rejected', error: e })),
      new Promise((resolve) => setTimeout(resolve, 0)).then(() => 'tick'),
    ]);
    // ensure promise is pending before abort
    expect(res).toBe('tick');

    abort(p);

    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('abortAll() rejects all pending promises', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});

    abortAll();

    const [r1, r2] = await Promise.allSettled([p1, p2]);
    expect(r1.status).toBe('rejected');
    expect(r2.status).toBe('rejected');
    expect(r1).toMatchObject({ reason: expect.objectContaining({ name: 'AbortError' }) });
    expect(r2).toMatchObject({ reason: expect.objectContaining({ name: 'AbortError' }) });
  });

  it('supports AbortSignal via control param', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const ac = new AbortController();
    const p = confirm({}, { signal: ac.signal });
    ac.abort();
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });
});
