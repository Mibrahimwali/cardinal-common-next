import { createCreateOrUpdateInstruction, PROGRAM_ID as TOKEN_AUTH_RULES_ID, } from "@metaplex-foundation/mpl-token-auth-rules";
import { createCreateInstruction, createMintInstruction, TokenStandard, } from "@metaplex-foundation/mpl-token-metadata";
import { encode } from "@msgpack/msgpack";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
import { Keypair, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY, Transaction, } from "@solana/web3.js";
import { findMintEditionId, findMintMetadataId, findRuleSetId, findTokenRecordId, } from "./pda";
import { executeTransaction } from "./transactions";
export const createProgrammableAsset = async (connection, wallet, uri = "uri") => {
    const mintKeypair = Keypair.generate();
    const mintId = mintKeypair.publicKey;
    const [tx, ata, rulesetId] = createProgrammableAssetTx(mintKeypair.publicKey, wallet.publicKey, uri);
    await executeTransaction(connection, tx, wallet, { signers: [mintKeypair] });
    return [ata, mintId, rulesetId];
};
export const createProgrammableAssetTx = (mintId, authority, uri = "uri") => {
    const metadataId = findMintMetadataId(mintId);
    const masterEditionId = findMintEditionId(mintId);
    const ataId = getAssociatedTokenAddressSync(mintId, authority);
    const rulesetName = `rs-${Math.floor(Date.now() / 1000)}`;
    const rulesetId = findRuleSetId(authority, rulesetName);
    const rulesetIx = createCreateOrUpdateInstruction({
        payer: authority,
        ruleSetPda: rulesetId,
    }, {
        createOrUpdateArgs: {
            __kind: "V1",
            serializedRuleSet: encode([
                1,
                authority.toBuffer().reduce((acc, i) => {
                    acc.push(i);
                    return acc;
                }, []),
                rulesetName,
                {
                    "Delegate:Staking": "Pass",
                    "Transfer:WalletToWallet": "Pass",
                    "Transfer:Owner": "Pass",
                    "Transfer:Delegate": "Pass",
                    "Transfer:TransferDelegate": "Pass",
                    "Delegate:LockedTransfer": "Pass",
                },
            ]),
        },
    });
    const createIx = createCreateInstruction({
        metadata: metadataId,
        masterEdition: masterEditionId,
        mint: mintId,
        authority: authority,
        payer: authority,
        splTokenProgram: TOKEN_PROGRAM_ID,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        updateAuthority: authority,
    }, {
        createArgs: {
            __kind: "V1",
            assetData: {
                name: `NFT - ${Math.floor(Date.now() / 1000)}`,
                symbol: "PNF",
                uri: uri,
                sellerFeeBasisPoints: 0,
                creators: [
                    {
                        address: authority,
                        share: 100,
                        verified: false,
                    },
                ],
                primarySaleHappened: false,
                isMutable: true,
                tokenStandard: TokenStandard.ProgrammableNonFungible,
                collection: null,
                uses: null,
                collectionDetails: null,
                ruleSet: rulesetId,
            },
            decimals: 0,
            printSupply: { __kind: "Zero" },
        },
    });
    const createIxWithSigner = {
        ...createIx,
        keys: createIx.keys.map((k) => k.pubkey.toString() === mintId.toString() ? { ...k, isSigner: true } : k),
    };
    const mintIx = createMintInstruction({
        token: ataId,
        tokenOwner: authority,
        metadata: metadataId,
        masterEdition: masterEditionId,
        tokenRecord: findTokenRecordId(mintId, ataId),
        mint: mintId,
        payer: authority,
        authority: authority,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        splAtaProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        splTokenProgram: TOKEN_PROGRAM_ID,
        authorizationRules: rulesetId,
        authorizationRulesProgram: TOKEN_AUTH_RULES_ID,
    }, {
        mintArgs: {
            __kind: "V1",
            amount: 1,
            authorizationData: null,
        },
    });
    return [
        new Transaction().add(rulesetIx, createIxWithSigner, mintIx),
        ataId,
        rulesetId,
    ];
};
/**
 * Build and execute mint Tx
 * @param connection
 * @param wallet
 * @param config
 * @returns
 */
export const createMint = async (connection, wallet, config) => {
    const mintKeypair = Keypair.generate();
    const mintId = mintKeypair.publicKey;
    const [tx, ata] = await createMintTx(connection, mintKeypair.publicKey, wallet.publicKey, config);
    await executeTransaction(connection, tx, wallet, { signers: [mintKeypair] });
    return [ata, mintId];
};
/**
 * Transaction for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export const createMintTx = async (connection, mintId, authority, config) => {
    const [ixs, ata] = await createMintIxs(connection, mintId, authority, config);
    const tx = new Transaction().add(...ixs);
    return [tx, ata];
};
/**
 * Instructions for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export const createMintIxs = async (connection, mintId, authority, config) => {
    const target = config?.target ?? authority;
    const ata = getAssociatedTokenAddressSync(mintId, target, true);
    return [
        [
            SystemProgram.createAccount({
                fromPubkey: authority,
                newAccountPubkey: mintId,
                space: MINT_SIZE,
                lamports: await getMinimumBalanceForRentExemptMint(connection),
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(mintId, config?.decimals ?? 0, authority, authority),
            createAssociatedTokenAccountInstruction(authority, ata, target, mintId),
            createMintToInstruction(mintId, ata, authority, config?.amount ?? 1),
        ],
        ata,
    ];
};
//# sourceMappingURL=mints.js.map