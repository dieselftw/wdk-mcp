import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";
import WdkManager from "@tetherto/wdk";

const InputSchema = z.object({
  seedId: z.string().describe("Unique identifier for the seed (e.g., 'main-seed', 'backup-seed')"),
  name: z.string().describe("Display name for the seed"),
  description: z.string().describe("Description of the seed's purpose"),
  chains: z.array(z.string()).optional().describe("Supported chains (e.g., ['ethereum', 'bitcoin'])")
});

const create_seed: WdkMcpTool<typeof InputSchema> = {
  name: "create_seed",
  description: "Create and store a new seed phrase in the database. This will be the master seed from which wallets are derived.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      db.createSeed(args.seedId, {
        name: args.name,
        type: 'bip39',
        description: args.description,
        chains: args.chains || [],
        wallets: [],
        seedphrase: WdkManager.getRandomSeedPhrase(),
      });
      
      return {
        success: true,
        seedId: args.seedId,
        message: `Seed '${args.name}' created successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { create_seed };

