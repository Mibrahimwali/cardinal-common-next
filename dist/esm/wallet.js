/**
 * A utility for creating a wallet interface given a publicKey. This can be used when a wallet parameter is required but it will not need to sign
 * @param publicKey
 * @returns A wallet interface with empty sign methods
 */
export const emptyWallet = (publicKey) => ({
    signTransaction: async (tx) => new Promise(() => tx),
    signAllTransactions: async (txs) => new Promise(() => txs),
    publicKey: publicKey,
});
//# sourceMappingURL=wallet.js.map