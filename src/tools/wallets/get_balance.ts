import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";
import wdkManager from "@tetherto/wdk";
import WdkManager from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";

const InputSchema = z.object({
  walletId: z.string().describe("The ID of the wallet to get the balance of"),
  address: z.string().describe("The address to get the balance of"),
});

const get_balance: WdkMcpTool<typeof InputSchema> = {
  name: "get_balance",
  description: "Get the balance of a specific wallet.",
  parameters: InputSchema,
  execute: async (args) => {
    const wallet = db.getWallet(args.walletId);
    
    if (!wallet) {
      return {
        success: false,
        error: `Wallet '${args.walletId}' not found`
      };
    }
   
    console.log(wallet.seedRef);
    const seed = db.getSeed(wallet.seedRef);
    if (!seed) {
      return {
        success: false,
        error: `Seed '${wallet.seedRef}' not found`
      };
    }
    
    console.log(seed);
    const wdk = new wdkManager(seed.seedphrase as string)
      .registerWallet(wallet.type, WalletManagerEvm, {
        provider: wallet.provider
      })

    const index = db.getAddressIndex(args.walletId, args.address);
    const account = await wdk.getAccount(wallet.type, index as number);
    const balance = await account.getBalance();
    const balanceEth = Number(balance) / 1e18
    
    return {
      success: true,
      balance: balanceEth
    };
  }
};

export { get_balance };

