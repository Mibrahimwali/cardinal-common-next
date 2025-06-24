import { getAssociatedTokenAddress } from "@solana/spl-token";
/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
export async function findAta(mint, owner, allowOwnerOffCurve) {
    return getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);
}
//# sourceMappingURL=token.js.map