import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const InputSchema = z.object({
  seedId: z.string().describe("The ID of the seed to delete")
});

const delete_seed: WdkMcpTool<typeof InputSchema> = {
  name: "delete_seed",
  description: "Delete a seed from the database. WARNING: This will fail if any wallets are still using this seed. Delete all associated wallets first.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      db.deleteSeed(args.seedId);
      
      return {
        success: true,
        seedId: args.seedId,
        message: `Seed '${args.seedId}' deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { delete_seed };

