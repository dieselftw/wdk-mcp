import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({
  keyName: z.string().describe("Name/identifier for the API key (e.g., 'alchemy-mainnet', 'infura-sepolia')"),
  keyValue: z.string().describe("The actual API key value")
});

const set_api_key: WdkMcpTool<typeof InputSchema> = {
  name: "set_api_key",
  description: "Store an API key securely in the database. Useful for storing RPC provider API keys.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      db.setApiKey(args.keyName, args.keyValue);
      
      return {
        success: true,
        keyName: args.keyName,
        message: `API key '${args.keyName}' stored successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { set_api_key };

