import { Connection } from "@solana/web3.js";
const networkURLs = {
    ["mainnet-beta"]: process.env.MAINNET_PRIMARY_URL ?? "https://solana-api.projectserum.com",
    mainnet: process.env.MAINNET_PRIMARY_URL ?? "https://solana-api.projectserum.com",
    devnet: "https://api.devnet.solana.com/",
    testnet: "https://api.testnet.solana.com/",
    localnet: "http://localhost:8899/",
};
export const connectionFor = (cluster, defaultCluster = "mainnet") => {
    return new Connection(process.env.RPC_URL || networkURLs[cluster || defaultCluster], "confirmed");
};
//# sourceMappingURL=connection.js.map