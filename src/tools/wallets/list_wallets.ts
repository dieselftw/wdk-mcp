import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const InputSchema = z.object({
  seedId: z.string().optional().describe("Filter wallets by seed ID (optional)")
});

const list_wallets: WdkMcpTool<typeof InputSchema> = {
  name: "list_wallets",
  description: "List all wallets or filter by seed. Shows wallet details including addresses and networks.",
  parameters: InputSchema,
  execute: async (args) => {
    const wallets = args.seedId 
      ? db.listWalletsBySeed(args.seedId)
      : db.listWallets();
    
    const walletList = Object.entries(wallets).map(([id, wallet]) => ({
      walletId: id,
      name: wallet.name,
      type: wallet.type,
      seedRef: wallet.seedRef,
      description: wallet.description,
      derivationPath: wallet.derivationPath,
      addresses: wallet.addresses,
      networks: wallet.networks,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt
    }));
    
    return {
      count: walletList.length,
      filterBySeed: args.seedId,
      wallets: walletList
    };
  }
};

export { list_wallets };

