import type { AccountFn } from "./types";
export declare const isError: (e: unknown) => e is Error;
/**
 * Wrap async function in try catch
 * @param p
 * @returns
 */
export declare const tryFn: <T>(fn: PromiseLike<T> | (() => T | PromiseLike<T>)) => T | Error | PromiseLike<T | Error>;
export declare const tryNull: <T>(fn: PromiseLike<T> | (() => T | PromiseLike<T>), errorHandler?: (e: Error) => void) => Promise<T | null | PromiseLike<T | null>>;
/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
export declare function tryGetAccount<T>(fn: AccountFn<T>): Promise<import("./types").AccountData<T> | null>;
//# sourceMappingURL=fns.d.ts.map