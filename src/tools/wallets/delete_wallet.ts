import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const InputSchema = z.object({
  walletId: z.string().describe("The ID of the wallet to delete")
});

const delete_wallet: WdkMcpTool<typeof InputSchema> = {
  name: "delete_wallet",
  description: "Delete a wallet from the database. This only removes the wallet entry, not the actual blockchain addresses.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      db.deleteWallet(args.walletId);
      
      return {
        success: true,
        walletId: args.walletId,
        message: `Wallet '${args.walletId}' deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { delete_wallet };

