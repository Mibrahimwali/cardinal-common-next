"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWrapSol = withWrapSol;
exports.createSyncNativeInstruction = createSyncNativeInstruction;
const BufferLayout = __importStar(require("@solana/buffer-layout"));
const splToken = __importStar(require("@solana/spl-token"));
const spl_token_1 = require("@solana/spl-token");
const web3 = __importStar(require("@solana/web3.js"));
const transactions_1 = require("./transactions");
async function withWrapSol(transaction, connection, wallet, lamports, skipInitTokenAccount = false) {
    const nativeAssociatedTokenAccountId = skipInitTokenAccount
        ? (0, spl_token_1.getAssociatedTokenAddressSync)(splToken.NATIVE_MINT, wallet.publicKey, true)
        : await (0, transactions_1.withFindOrInitAssociatedTokenAccount)(transaction, connection, splToken.NATIVE_MINT, wallet.publicKey, wallet.publicKey);
    transaction.add(web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: nativeAssociatedTokenAccountId,
        lamports,
    }));
    transaction.add(createSyncNativeInstruction(nativeAssociatedTokenAccountId));
    return transaction;
}
function createSyncNativeInstruction(nativeAccount) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 17, // SyncNative instruction
    }, data);
    const keys = [{ pubkey: nativeAccount, isSigner: false, isWritable: true }];
    return new web3.TransactionInstruction({
        keys,
        programId: splToken.TOKEN_PROGRAM_ID,
        data,
    });
}
//# sourceMappingURL=wrappedSol.js.map