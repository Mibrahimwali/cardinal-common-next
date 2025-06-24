"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestConnection = getTestConnection;
exports.newAccountWithLamports = newAccountWithLamports;
const web3_js_1 = require("@solana/web3.js");
function getTestConnection() {
    const url = "http://127.0.0.1:8899";
    return new web3_js_1.Connection(url, "confirmed");
}
async function newAccountWithLamports(connection, lamports = web3_js_1.LAMPORTS_PER_SOL * 10, keypair = web3_js_1.Keypair.generate()) {
    const account = keypair;
    const signature = await connection.requestAirdrop(account.publicKey, lamports);
    await connection.confirmTransaction(signature, "confirmed");
    return account;
}
//# sourceMappingURL=workspace.js.map