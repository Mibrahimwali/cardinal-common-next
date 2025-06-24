"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionFor = void 0;
const web3_js_1 = require("@solana/web3.js");
const networkURLs = {
    ["mainnet-beta"]: process.env.MAINNET_PRIMARY_URL ?? "https://solana-api.projectserum.com",
    mainnet: process.env.MAINNET_PRIMARY_URL ?? "https://solana-api.projectserum.com",
    devnet: "https://api.devnet.solana.com/",
    testnet: "https://api.testnet.solana.com/",
    localnet: "http://localhost:8899/",
};
const connectionFor = (cluster, defaultCluster = "mainnet") => {
    return new web3_js_1.Connection(process.env.RPC_URL || networkURLs[cluster || defaultCluster], "confirmed");
};
exports.connectionFor = connectionFor;
//# sourceMappingURL=connection.js.map