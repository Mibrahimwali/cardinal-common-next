import * as splToken from "@solana/spl-token";
import { sendAndConfirmRawTransaction, TransactionMessage, VersionedTransaction, } from "@solana/web3.js";
import { chunkArray } from "./utils";
/**
 * Utility function for adding a find or init associated token account instruction to a transaction
 * Useful when using associated token accounts so you can be sure they are created before hand
 * @param transaction
 * @param connection
 * @param mint
 * @param owner
 * @param payer
 * @param allowOwnerOffCurve
 * @returns The associated token account ID that was found or will be created. This also adds the relevent instruction to create it to the transaction if not found
 */
export async function withFindOrInitAssociatedTokenAccount(transaction, connection, mint, owner, payer, allowOwnerOffCurve) {
    const associatedAddress = await splToken.getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);
    const account = await connection.getAccountInfo(associatedAddress);
    if (!account) {
        transaction.add(splToken.createAssociatedTokenAccountInstruction(payer, associatedAddress, owner, mint));
    }
    return associatedAddress;
}
export async function executeTransaction(connection, tx, wallet, config) {
    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const lookupTableAccounts = config?.lookupTableIds
        ? (await Promise.all(config?.lookupTableIds?.map((lookupTableId) => connection.getAddressLookupTable(lookupTableId)) ?? []))
            .map((lut) => lut.value)
            .filter((x) => x !== null)
        : [];
    const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions: tx.instructions,
    }).compileToV0Message(lookupTableAccounts);
    let transactionV0 = new VersionedTransaction(messageV0);
    transactionV0 = await wallet.signTransaction(transactionV0);
    if (config?.signers) {
        transactionV0.sign(config?.signers ?? []);
    }
    try {
        const txid = await sendAndConfirmRawTransaction(connection, Buffer.from(transactionV0.serialize()), config?.confirmOptions);
        return txid;
    }
    catch (e) {
        if (!config?.silent) {
            logError(e);
        }
        throw e;
    }
}
export async function executeTransactions(connection, txs, wallet, config) {
    const latestBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signedTxs = await wallet.signAllTransactions(txs.map((tx) => {
        tx.recentBlockhash = latestBlockhash;
        tx.feePayer = wallet.publicKey;
        if (config?.signers) {
            tx.partialSign(...(config?.signers ?? []));
        }
        return tx;
    }));
    const batchedTxs = chunkArray(signedTxs, config?.batchSize ?? signedTxs.length);
    const txids = [];
    for (let i = 0; i < batchedTxs.length; i++) {
        const batch = batchedTxs[i];
        if (batch) {
            const batchTxids = await Promise.all(batch.map(async (tx) => {
                try {
                    const txid = await sendAndConfirmRawTransaction(connection, tx.serialize(), config?.confirmOptions);
                    return txid;
                }
                catch (e) {
                    if (config?.errorHandler) {
                        return config?.errorHandler(e);
                    }
                    logError(e);
                    return null;
                }
            }));
            txids.push(...batchTxids);
        }
    }
    return txids;
}
export async function executeTransactionSequence(connection, txs, wallet, config) {
    const latestBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signedTxs = await wallet.signAllTransactions(txs.flat().map(({ tx, signers }) => {
        tx.recentBlockhash = latestBlockhash;
        tx.feePayer = wallet.publicKey;
        if (signers) {
            tx.partialSign(...signers);
        }
        return tx;
    }));
    const txids = [[]];
    let count = 0;
    for (let i = 0; i < txs.length; i++) {
        const txChunk = txs[i];
        if (!txChunk)
            continue;
        const signedTxBatch = signedTxs.slice(count, count + txChunk.length);
        count += txChunk.length;
        const batchedTxs = chunkArray(signedTxBatch, config?.batchSize ?? signedTxBatch.length);
        const allBatchTxids = [];
        for (let j = 0; j < batchedTxs.length; j++) {
            const batch = batchedTxs[j];
            if (batch) {
                const batchTxids = await Promise.all(batch.map(async (tx, k) => {
                    try {
                        const txid = await sendAndConfirmRawTransaction(connection, tx.serialize(), config?.confirmOptions);
                        if (config?.successHandler) {
                            config?.successHandler({
                                count: count + (j + 1) * k,
                                sequence: i,
                                sequenceCount: (j + 1) * k,
                            });
                        }
                        return txid;
                    }
                    catch (e) {
                        if (config?.errorHandler) {
                            return config?.errorHandler(e, {
                                count: count + (j + 1) * k,
                                sequence: i,
                                sequenceCount: (j + 1) * k,
                            });
                        }
                        logError(e);
                        return null;
                    }
                }));
                allBatchTxids.push(...batchTxids);
            }
        }
        txids.push(allBatchTxids);
    }
    return txids;
}
export const logError = (e) => {
    const message = e.message ?? "";
    const logs = e.logs;
    if (logs) {
        console.log(logs, message);
    }
    else {
        console.log(e, message);
    }
};
//# sourceMappingURL=transactions.js.map