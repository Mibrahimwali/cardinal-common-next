"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAccountDataById = exports.getBatchedMultipleAccounts = exports.fetchIdlAccountDataById = exports.decodeIdlAccountInfos = exports.getProgramIdlAccounts = exports.tryDecodeIdlAccountUnknown = exports.decodeIdlAccountUnknown = exports.tryDecodeIdlAccount = exports.decodeIdlAccount = exports.fetchIdlAccountNullable = exports.fetchIdlAccount = void 0;
const anchor_1 = require("@coral-xyz/anchor");
/**
 * Fetch an account with idl types
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @returns
 */
const fetchIdlAccount = async (connection, pubkey, accountType, idl, config) => {
    const account = await (0, exports.fetchIdlAccountNullable)(connection, pubkey, accountType, idl, config);
    if (!account)
        throw "Account info not found";
    return account;
};
exports.fetchIdlAccount = fetchIdlAccount;
/**
 * Fetch a possibly null account with idl types of a specific type
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @param idl
 * @returns
 */
const fetchIdlAccountNullable = async (connection, pubkey, accountType, idl, config) => {
    const accountInfo = await connection.getAccountInfo(pubkey, config);
    if (!accountInfo)
        return null;
    try {
        const parsed = new anchor_1.BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
        return {
            ...accountInfo,
            pubkey,
            parsed,
            type: accountType,
        };
    }
    catch (e) {
        return null;
    }
};
exports.fetchIdlAccountNullable = fetchIdlAccountNullable;
/**
 * Decode an account with idl types of a specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
const decodeIdlAccount = (accountInfo, accountType, idl) => {
    const parsed = new anchor_1.BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
    return {
        ...accountInfo,
        type: accountType,
        parsed,
    };
};
exports.decodeIdlAccount = decodeIdlAccount;
/**
 * Try to decode an account with idl types of specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
const tryDecodeIdlAccount = (accountInfo, accountType, idl) => {
    try {
        return (0, exports.decodeIdlAccount)(accountInfo, accountType, idl);
    }
    catch (e) {
        return {
            ...accountInfo,
            type: "unknown",
            parsed: null,
        };
    }
};
exports.tryDecodeIdlAccount = tryDecodeIdlAccount;
/**
 * Decode an idl account of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
const decodeIdlAccountUnknown = (accountInfo, idl) => {
    if (!accountInfo)
        throw "No account found";
    // get idl accounts
    const idlAccounts = idl["accounts"];
    if (!idlAccounts)
        throw "No account definitions found in IDL";
    // find matching account name
    const accountTypes = idlAccounts.map((a) => a.name);
    const accountType = accountTypes?.find((accountType) => anchor_1.BorshAccountsCoder.accountDiscriminator(accountType).compare(accountInfo.data.subarray(0, 8)) === 0);
    if (!accountType)
        throw "No account discriminator match found";
    // decode
    const parsed = new anchor_1.BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
    return {
        ...accountInfo,
        type: accountType,
        parsed,
    };
};
exports.decodeIdlAccountUnknown = decodeIdlAccountUnknown;
/**
 * Try to decode an account with idl types of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
const tryDecodeIdlAccountUnknown = (accountInfo, idl) => {
    try {
        return (0, exports.decodeIdlAccountUnknown)(accountInfo, idl);
    }
    catch (e) {
        return {
            ...accountInfo,
            type: "unknown",
            parsed: null,
        };
    }
};
exports.tryDecodeIdlAccountUnknown = tryDecodeIdlAccountUnknown;
/**
 * Get program accounts of a specific idl type
 * @param connection
 * @param accountType
 * @param config
 * @param programId
 * @param idl
 * @returns
 */
const getProgramIdlAccounts = async (connection, accountType, programId, idl, config) => {
    const accountInfos = await connection.getProgramAccounts(programId, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: anchor_1.utils.bytes.bs58.encode(anchor_1.BorshAccountsCoder.accountDiscriminator(accountType)),
                },
            },
            ...(config?.filters ?? []),
        ],
    });
    return accountInfos.map((accountInfo) => ({
        pubkey: accountInfo.pubkey,
        ...(0, exports.tryDecodeIdlAccount)(accountInfo.account, accountType, idl),
    }));
};
exports.getProgramIdlAccounts = getProgramIdlAccounts;
/**
 * Decode account infos with corresponding ids
 * @param accountIds
 * @param accountInfos
 * @returns
 */
const decodeIdlAccountInfos = (accountIds, accountInfos, programId, idl) => {
    return accountInfos.reduce((acc, accountInfo, i) => {
        if (!accountInfo?.data)
            return acc;
        const accountId = accountIds[i];
        if (!accountId)
            return acc;
        const accoutIdString = accountId?.toString() ?? "";
        const ownerString = accountInfo.owner.toString();
        const baseData = {
            timestamp: Date.now(),
            pubkey: accountId,
        };
        switch (ownerString) {
            // stakePool
            case programId.toString(): {
                acc[accoutIdString] = {
                    ...baseData,
                    ...(0, exports.tryDecodeIdlAccountUnknown)(accountInfo, idl),
                };
                return acc;
            }
            // fallback
            default:
                acc[accoutIdString] = {
                    ...baseData,
                    ...accountInfo,
                    type: "unknown",
                    parsed: null,
                };
                return acc;
        }
    }, {});
};
exports.decodeIdlAccountInfos = decodeIdlAccountInfos;
const fetchIdlAccountDataById = async (connection, ids, programId, idl) => {
    const filteredIds = ids.filter((id) => id !== null);
    const accountInfos = await (0, exports.getBatchedMultipleAccounts)(connection, filteredIds);
    return (0, exports.decodeIdlAccountInfos)(filteredIds, accountInfos, programId, idl);
};
exports.fetchIdlAccountDataById = fetchIdlAccountDataById;
/**
 * Fecthes multiple accounts in batches since there is a limit of
 * 100 accounts per connection.getMultipleAccountsInfo call
 * @param connection
 * @param ids
 * @param config
 * @param batchSize
 * @returns
 */
const getBatchedMultipleAccounts = async (connection, ids, config, batchSize = 100) => {
    const batches = [[]];
    ids.forEach((id) => {
        const batch = batches[batches.length - 1];
        if (batch) {
            if (batch.length >= batchSize) {
                batches.push([id]);
            }
            else {
                batch.push(id);
            }
        }
    });
    const batchAccounts = await Promise.all(batches.map((b) => b.length > 0 ? connection.getMultipleAccountsInfo(b, config) : []));
    return batchAccounts.flat();
};
exports.getBatchedMultipleAccounts = getBatchedMultipleAccounts;
/**
 * Batch fetch a map of accounts and their corresponding ids
 * @param connection
 * @param ids
 * @returns
 */
const fetchAccountDataById = async (connection, ids) => {
    const filteredIds = ids.filter((id) => id !== null);
    const accountInfos = await (0, exports.getBatchedMultipleAccounts)(connection, filteredIds);
    return accountInfos.reduce((acc, accountInfo, i) => {
        if (!accountInfo?.data)
            return acc;
        const pubkey = ids[i];
        if (!pubkey)
            return acc;
        acc[pubkey.toString()] = {
            pubkey,
            ...accountInfo,
        };
        return acc;
    }, {});
};
exports.fetchAccountDataById = fetchAccountDataById;
//# sourceMappingURL=accounts.js.map