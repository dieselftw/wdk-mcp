import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({
  seedId: z.string().describe("The ID of the seed to update"),
  name: z.string().optional().describe("New display name"),
  description: z.string().optional().describe("New description"),
  chains: z.array(z.string()).optional().describe("New list of supported chains"),
});

const update_seed: WdkMcpTool<typeof InputSchema> = {
  name: "update_seed",
  description: "Update a seed's metadata.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      const { seedId, ...updates } = args;
      
      db.updateSeed(seedId, updates);
      
      return {
        success: true,
        seedId: seedId,
        message: `Seed '${seedId}' updated successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { update_seed };

