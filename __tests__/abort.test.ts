import * as React from 'react';
import { confirmable, createConfirmation, abort, abortAll } from 'src';

describe('Cancellation (abort) behavior', () => {
  // 自動的に解決しないダイアログ（手動でabortするまで待機）
  const HangingDialog = ({ show }: any) => (show ? React.createElement('div', { 'data-testid': 'hanging' }) : null);
  const ConfirmableHanging = confirmable(HangingDialog);

  it('abort(promise) rejects with AbortError and unmounts', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p = confirm({});

    // Promiseが未解決であることを確認
    const res = await Promise.race([
      p.then(() => ({ status: 'fulfilled' })).catch((e) => ({ status: 'rejected', error: e })),
      new Promise((resolve) => setTimeout(resolve, 0)).then(() => 'tick'),
    ]);
    expect(res).toBe('tick');

    // abort実行
    abort(p);

    // AbortErrorでrejectされることを確認
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('abortAll() rejects all pending promises', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});

    // 全てをabort
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

    // 先にabort
    const result = abort(p);
    expect(result).toBe(true);

    // settled後に再度abortを試みる
    await p.catch(() => {});
    const result2 = abort(p);
    expect(result2).toBe(false);
  });

  it('handles already aborted signal', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const ac = new AbortController();
    ac.abort();

    const p = confirm({}, { signal: ac.signal });

    // 既にabortedなので即座にreject
    await expect(p).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('multiple dialogs can be aborted independently', async () => {
    const confirm = createConfirmation(ConfirmableHanging);
    const p1 = confirm({});
    const p2 = confirm({});
    const p3 = confirm({});

    // p2だけをabort
    abort(p2);

    // p2はabortされるが、p1とp3はまだpending
    const r2 = await p2.catch((e) => e);
    expect(r2).toMatchObject({ name: 'AbortError' });

    // p1とp3がまだpendingであることを確認
    const res1 = await Promise.race([
      p1.then(() => 'resolved').catch(() => 'rejected'),
      new Promise((resolve) => setTimeout(() => resolve('pending'), 10)),
    ]);
    expect(res1).toBe('pending');

    // p1とp3をクリーンアップ
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
