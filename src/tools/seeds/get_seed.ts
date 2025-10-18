import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({
  seedId: z.string().describe("The ID of the seed to retrieve"),
});

const get_seed: WdkMcpTool<typeof InputSchema> = {
  name: "get_seed",
  description: "Get details of a specific seed by its ID",
  parameters: InputSchema,
  execute: async (args) => {
    const seed = db.getSeed(args.seedId);
    
    if (!seed) {
      return {
        success: false,
        error: `Seed '${args.seedId}' not found`
      };
    }
    
    return {
      success: true,
      seed: {
        seedId: args.seedId,
        name: seed.name,
        type: seed.type,
        description: seed.description,
        chains: seed.chains,
        wallets: seed.wallets,
        createdAt: seed.createdAt,
        updatedAt: seed.updatedAt
      }
    };
  }
};

export { get_seed };

