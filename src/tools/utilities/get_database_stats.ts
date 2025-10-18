import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({});

const get_database_stats: WdkMcpTool<typeof InputSchema> = {
  name: "get_database_stats",
  description: "Get statistics about the wallet database including counts of seeds, wallets, and API keys.",
  parameters: InputSchema,
  execute: async (args) => {
    const stats = db.getStats();
    
    // Get more detailed stats
    const seeds = db.listSeeds();
    const wallets = db.listWallets();
    
    const walletsByType: Record<string, number> = {};
    Object.values(wallets).forEach(wallet => {
      walletsByType[wallet.type] = (walletsByType[wallet.type] || 0) + 1;
    });
    
    return {
      ...stats,
      walletsByType,
      details: {
        seeds: Object.keys(seeds).length,
        wallets: Object.keys(wallets).length,
        apiKeys: stats.apiKeyCount
      }
    };
  }
};

export { get_database_stats };

