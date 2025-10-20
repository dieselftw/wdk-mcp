import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import WalletManagerBtc from "@tetherto/wdk-wallet-btc";
import WdkManager from "@tetherto/wdk";

const InputSchema = z.object({
  walletId: z.string().describe("Unique identifier for the wallet (e.g., 'eth-main', 'btc-savings')"),
  name: z.string().describe("Display name for the wallet"),
  seedRef: z.string().describe("The seed ID to use for this wallet"),
  type: z.enum(['ethereum', 'bitcoin', 'hoodi']).describe("Type of wallet to create"),
  provider: z.string().optional().describe("Provider URL for the wallet"),
  description: z.string().optional().describe("Optional description"),
  derivationPath: z.string().optional().describe("Custom derivation path (uses default if not provided)"),
  addressCount: z.number().optional().describe("Number of addresses to generate (default: 1)")
});

const create_wallet: WdkMcpTool<typeof InputSchema> = {
  name: "create_wallet",
  description: "Create a new wallet derived from an existing seed. Automatically generates addresses using the Tether WDK.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      // Get the seed
      const seed = db.getSeed(args.seedRef);
      if (!seed || !seed.seedphrase) {
        return {
          success: false,
          error: `Seed '${args.seedRef}' not found or has no seed phrase`
        };
      }
      
      // Generate addresses based on wallet type
      const addresses: string[] = [];
      const addressCount = args.addressCount || 1;

      const manager = (() => {
        const managers = {
          ethereum: () => new WalletManagerEvm(seed.seedphrase as string),
          bitcoin: () => new WalletManagerBtc(seed.seedphrase as string),
          hoodi: () => new WalletManagerEvm(seed.seedphrase as string),
        } as const;
        
        const createManager = managers[args.type];
        if (!createManager) {
          throw new Error(`Unsupported wallet type: ${args.type}`);
        }
        
        return createManager();
      })();
      
      for (let i = 0; i < addressCount; i++) {
        const account = await manager.getAccount(i);
        const address = await account.getAddress();
        addresses.push(address);
      }

      const wallet = new WdkManager(seed.seedphrase as string)
        .registerWallet(args.type, WalletManagerEvm, {
          provider: args.provider || 'https://eth.drpc.org' // Default to Ethereum Mainnet
        })
      
      // Store wallet in database
      db.createWallet(args.walletId, {
        name: args.name,
        seedRef: args.seedRef,
        type: args.type,
        provider: args.provider || 'https://eth.drpc.org',
        description: args.description,
        derivationPath: args.derivationPath || (args.type === 'ethereum' ? "m/44'/60'/0'/0" : "m/84'/0'/0'/0"),
        addresses: addresses
      });
      
      return {
        success: true,
        walletId: args.walletId,
        type: args.type,
        addresses: addresses,
        message: `Wallet '${args.name}' created with ${addresses.length} address(es)`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { create_wallet };

