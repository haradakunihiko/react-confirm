// 未解決の確認ダイアログを外部から制御するための軽量なレジストリ
// UIの状態ではなく、制御用のハンドル（reject/dispose）のみを保持

/**
 * 確認ダイアログをキャンセルする際にスローされるカスタムエラー
 */
export class AbortError extends Error {
  constructor(message: string = 'Aborted') {
    super(message);
    this.name = 'AbortError';
  }
}

/**
 * 確認ダイアログの制御ハンドル
 */
export type ConfirmationHandle = {
  reject: (reason?: Error) => void;
  dispose: () => void;
  settled?: boolean;
};

const active = new Map<Promise<unknown>, ConfirmationHandle>();

/**
 * AbortErrorを作成する（reasonが提供されていない場合）
 */
function createAbortError(reason?: Error): Error {
  if (reason !== undefined) return reason;

  // DOMExceptionが利用可能であれば使用（標準的なAbortError）
  if (typeof DOMException !== 'undefined') {
    try {
      return new DOMException('Aborted', 'AbortError');
    } catch {
      // フォールバック
    }
  }

  return new AbortError();
}

/**
 * Promiseとそのハンドルをレジストリに登録
 */
export function register(promise: Promise<unknown>, handle: ConfirmationHandle): void {
  active.set(promise, handle);

  // settled後は自動的にクリーンアップ
  promise
    .finally(() => {
      const h = active.get(promise);
      if (h) h.settled = true;
      active.delete(promise);
    })
    .catch(() => {
      // finallyで処理済みなので無視
    });
}

/**
 * 個別のPromiseをキャンセル
 * @param promise キャンセルするPromise
 * @param reason キャンセル理由（省略時はAbortErrorが使用される）
 * @returns キャンセルに成功した場合はtrue
 */
export function abort(promise: Promise<unknown>, reason?: Error): boolean {
  const handle = active.get(promise);
  if (!handle || handle.settled) return false;

  try {
    handle.reject(createAbortError(reason));
  } finally {
    try {
      handle.dispose();
    } catch {
      // 無視
    }
    active.delete(promise);
  }

  return true;
}

/**
 * 全ての未解決Promiseをキャンセル
 * @param reason キャンセル理由（省略時はAbortErrorが使用される）
 * @returns キャンセルされたPromiseの数
 */
export function abortAll(reason?: Error): number {
  const items = Array.from(active.entries());
  let count = 0;

  for (const [p, h] of items) {
    if (h.settled) {
      active.delete(p);
      continue;
    }

    try {
      h.reject(createAbortError(reason));
    } finally {
      try {
        h.dispose();
      } catch {
        // 無視
      }
      active.delete(p);
      count++;
    }
  }

  return count;
}

/**
 * AbortSignalをPromiseに紐付ける
 * @param signal AbortSignal
 * @param promise 紐付けるPromise
 * @returns デタッチ用の関数
 */
export function attachAbortSignal(signal: AbortSignal, promise: Promise<unknown>): () => void {
  const onAbort = () => {
    abort(promise, signal.reason);
  };

  // 既にabortedの場合は即座に実行
  if (signal.aborted) {
    onAbort();
    return () => {};
  }

  signal.addEventListener('abort', onAbort, { once: true });
  return () => signal.removeEventListener('abort', onAbort);
}
