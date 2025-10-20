import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";
import wdkManager from "@tetherto/wdk";
import WalletManagerEvm from "@tetherto/wdk-wallet-evm";

const InputSchema = z.object({
  walletId: z.string().describe("The ID of the sender wallet"),
  fromAddress: z.string().describe("The address to send the money from"),
  toAddress: z.string().describe("The address to send the money to"),
  amount: z.number().describe("Amount of tokens to send")
});

const send_transaction: WdkMcpTool<typeof InputSchema> = {
  name: "send_transaction",
  description: "Send a transaction to and form a wallet.",
  parameters: InputSchema,
  execute: async (args) => {
    const wallet = db.getWallet(args.walletId);
    
    if (!wallet) {
      return {
        success: false,
        error: `Wallet '${args.walletId}' not found`
      };
    }
   
    const seed = db.getSeed(wallet.seedRef);
    if (!seed) {
      return {
        success: false,
        error: `Seed '${wallet.seedRef}' not found`
      };
    }
    
    const wdk = new wdkManager(seed.seedphrase as string)
      .registerWallet(wallet.type, WalletManagerEvm, {
        provider: wallet.provider
      })

    const index = db.getAddressIndex(args.walletId, args.fromAddress);
    const account = await wdk.getAccount(wallet.type, index as number);
    
    const ethResult = await account.sendTransaction({
        to: args.toAddress,
        value: BigInt(args.amount * 1e18) // Convert to wei
      })
    
    return {
      success: true,
      hash : ethResult.hash,
      fee : Number(ethResult.fee)
    };
  }
};

export { send_transaction };

