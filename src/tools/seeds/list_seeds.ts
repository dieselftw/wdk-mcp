import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const InputSchema = z.object({});

const list_seeds: WdkMcpTool<typeof InputSchema> = {
  name: "list_seeds",
  description: "List all stored seeds with their metadata.",
  parameters: InputSchema,
  execute: async (args) => {
    const seeds = db.listSeeds();
    
    const seedList = Object.entries(seeds).map(([id, seed]) => ({
      seedId: id,
      name: seed.name,
      type: seed.type,
      description: seed.description,
      chains: seed.chains,
      walletCount: seed.wallets.length,
      wallets: seed.wallets,
      createdAt: seed.createdAt,
      updatedAt: seed.updatedAt
    }));
    
    return {
      count: seedList.length,
      seeds: seedList
    };
  }
};

export { list_seeds };

