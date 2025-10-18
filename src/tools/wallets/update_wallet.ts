import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const NetworkConfigSchema = z.object({
  rpc: z.string(),
  chainId: z.number().optional()
});

const InputSchema = z.object({
  walletId: z.string().describe("The ID of the wallet to update"),
  name: z.string().optional().describe("New display name"),
  description: z.string().optional().describe("New description"),
  networks: z.record(z.string(), NetworkConfigSchema).optional().describe("Network configurations (RPC endpoints and chain IDs)")
});

const update_wallet: WdkMcpTool<typeof InputSchema> = {
  name: "update_wallet",
  description: "Update a wallet's metadata, including name, description, and network configurations. Cannot change type or seed reference.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      const { walletId, ...updates } = args;
      
      db.updateWallet(walletId, updates as any);
      
      return {
        success: true,
        walletId: walletId,
        message: `Wallet '${walletId}' updated successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { update_wallet };

