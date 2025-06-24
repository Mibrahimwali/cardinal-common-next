function isPromiseLike(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function");
}
function tryify(fn) {
    return fn.then((v) => v, (err) => (isError(err) ? err : new Error(String(err))));
}
export const isError = (e) => {
    return e instanceof Error;
};
/**
 * Wrap async function in try catch
 * @param p
 * @returns
 */
export const tryFn = (fn) => {
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
export const tryNull = async (fn, errorHandler) => {
    const v = await tryFn(fn);
    if (isError(v)) {
        errorHandler && errorHandler(v);
        return null;
    }
    return v;
};
/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
export async function tryGetAccount(fn) {
    try {
        return await fn();
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=fns.js.map