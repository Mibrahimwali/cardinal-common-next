import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
export function getTestConnection() {
    const url = "http://127.0.0.1:8899";
    return new Connection(url, "confirmed");
}
export async function newAccountWithLamports(connection, lamports = LAMPORTS_PER_SOL * 10, keypair = Keypair.generate()) {
    const account = keypair;
    const signature = await connection.requestAirdrop(account.publicKey, lamports);
    await connection.confirmTransaction(signature, "confirmed");
    return account;
}
//# sourceMappingURL=workspace.js.map