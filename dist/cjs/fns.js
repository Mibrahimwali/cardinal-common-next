"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryNull = exports.tryFn = exports.isError = void 0;
exports.tryGetAccount = tryGetAccount;
function isPromiseLike(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function");
}
function tryify(fn) {
    return fn.then((v) => v, (err) => ((0, exports.isError)(err) ? err : new Error(String(err))));
}
const isError = (e) => {
    return e instanceof Error;
};
exports.isError = isError;
/**
 * Wrap async function in try catch
 * @param p
 * @returns
 */
const tryFn = (fn) => {
    if (isPromiseLike(fn))
        return tryify(fn);
    try {
        const v = fn();
        if (isPromiseLike(v))
            return tryify(v);
        return v;
    }
    catch (err) {
        return new Error(String(err));
    }
};
exports.tryFn = tryFn;
const tryNull = async (fn, errorHandler) => {
    const v = await (0, exports.tryFn)(fn);
    if ((0, exports.isError)(v)) {
        errorHandler && errorHandler(v);
        return null;
    }
    return v;
};
exports.tryNull = tryNull;
/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
async function tryGetAccount(fn) {
    try {
        return await fn();
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=fns.js.map