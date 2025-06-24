"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAta = findAta;
const spl_token_1 = require("@solana/spl-token");
/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
async function findAta(mint, owner, allowOwnerOffCurve) {
    return (0, spl_token_1.getAssociatedTokenAddress)(mint, owner, allowOwnerOffCurve);
}
//# sourceMappingURL=token.js.map