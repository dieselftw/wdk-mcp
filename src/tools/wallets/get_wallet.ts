import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({
  walletId: z.string().describe("The ID of the wallet to retrieve")
});

const get_wallet: WdkMcpTool<typeof InputSchema> = {
  name: "get_wallet",
  description: "Get detailed information about a specific wallet including all addresses and network configurations.",
  parameters: InputSchema,
  execute: async (args) => {
    const wallet = db.getWallet(args.walletId);
    
    if (!wallet) {
      return {
        success: false,
        error: `Wallet '${args.walletId}' not found`
      };
    }
    
    return {
      success: true,
      wallet: {
        walletId: args.walletId,
        name: wallet.name,
        type: wallet.type,
        seedRef: wallet.seedRef,
        description: wallet.description,
        derivationPath: wallet.derivationPath,
        addresses: wallet.addresses,
        networks: wallet.networks,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      }
    };
  }
};

export { get_wallet };

