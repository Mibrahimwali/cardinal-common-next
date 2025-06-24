"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryPublicKey = void 0;
exports.shortPubKey = shortPubKey;
exports.pubKeyUrl = pubKeyUrl;
exports.transactionUrl = transactionUrl;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
function shortPubKey(pubkey, startChars = 4, endChars = startChars) {
    if (!pubkey)
        return "";
    return `${pubkey?.toString().substring(0, startChars)}..${pubkey
        ?.toString()
        .substring(pubkey?.toString().length - endChars)}`;
}
function pubKeyUrl(pubkey, cluster) {
    if (!pubkey)
        return "https://explorer.solana.com";
    return `https://explorer.solana.com/address/${pubkey.toString()}/metadata${cluster === "devnet" ? "?cluster=devnet" : ""}`;
}
const tryPublicKey = (publicKeyString) => {
    if (!publicKeyString)
        return null;
    try {
        return new web3_js_1.PublicKey(publicKeyString);
    }
    catch (e) {
        return null;
    }
};
exports.tryPublicKey = tryPublicKey;
function transactionUrl(txid, cluster) {
    return (0, utils_1.withCluster)(`https://explorer.solana.com/tx/${txid}`, cluster);
}
//# sourceMappingURL=publicKeys.js.map