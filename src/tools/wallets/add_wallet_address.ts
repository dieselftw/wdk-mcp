import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";
import WdkManager from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";
import WalletManagerBtc from "@tetherto/wdk-wallet-btc";

const InputSchema = z.object({
  walletId: z.string().describe("The ID of the wallet to add an address to"),
  count: z.number().optional().describe("Number of new addresses to generate (default: 1)")
});

const add_wallet_address: WdkMcpTool<typeof InputSchema> = {
  name: "add_wallet_address",
  description: "Generate and add new addresses to an existing wallet using the next derivation index.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      const wallet = db.getWallet(args.walletId);
      if (!wallet) {
        return {
          success: false,
          error: `Wallet '${args.walletId}' not found`
        };
      }
      
      // Get the seed
      const seed = db.getSeed(wallet.seedRef);
      if (!seed || !seed.seedphrase) {
        return {
          success: false,
          error: `Seed '${wallet.seedRef}' not found or has no seed phrase`
        };
      }
      
      const count = args.count || 1;
      const newAddresses: string[] = [];
      const currentCount = wallet.addresses.length;
      
      if (wallet.type === 'ethereum') {
        const evmManager = new WalletManagerEvm(seed.seedphrase);
        
        for (let i = 0; i < count; i++) {
          const account = await evmManager.getAccount(currentCount + i);
          const address = await account.getAddress();
          newAddresses.push(address);
        }
      } else if (wallet.type === 'bitcoin') {
        const btcManager = new WalletManagerBtc(seed.seedphrase);
        
        for (let i = 0; i < count; i++) {
          const account = await btcManager.getAccount(currentCount + i);
          const address = await account.getAddress();
          newAddresses.push(address);
        }
      }
      
      // Update wallet with new addresses
      db.updateWallet(args.walletId, {
        addresses: [...wallet.addresses, ...newAddresses]
      });
      
      return {
        success: true,
        walletId: args.walletId,
        newAddresses: newAddresses,
        totalAddresses: wallet.addresses.length + newAddresses.length,
        message: `Added ${newAddresses.length} new address(es) to wallet`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { add_wallet_address };

