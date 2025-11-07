/**
 * 確認ダイアログをキャンセルする際にスローされるカスタムエラー
 */
export declare class AbortError extends Error {
    constructor(message?: string);
}
/**
 * 確認ダイアログの制御ハンドル
 */
export type ConfirmationHandle = {
    reject: (reason?: Error) => void;
    dispose: () => void;
    settled?: boolean;
};
/**
 * Promiseとそのハンドルをレジストリに登録
 */
export declare function register(promise: Promise<unknown>, handle: ConfirmationHandle): void;
/**
 * 個別のPromiseをキャンセル
 * @param promise キャンセルするPromise
 * @param reason キャンセル理由（省略時はAbortErrorが使用される）
 * @returns キャンセルに成功した場合はtrue
 */
export declare function abort(promise: Promise<unknown>, reason?: Error): boolean;
/**
 * 全ての未解決Promiseをキャンセル
 * @param reason キャンセル理由（省略時はAbortErrorが使用される）
 * @returns キャンセルされたPromiseの数
 */
export declare function abortAll(reason?: Error): number;
/**
 * AbortSignalをPromiseに紐付ける
 * @param signal AbortSignal
 * @param promise 紐付けるPromise
 * @returns デタッチ用の関数
 */
export declare function attachAbortSignal(signal: AbortSignal, promise: Promise<unknown>): () => void;
