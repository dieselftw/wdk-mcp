import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const InputSchema = z.object({
  keyName: z.string().describe("Name/identifier of the API key to retrieve")
});

const get_api_key: WdkMcpTool<typeof InputSchema> = {
  name: "get_api_key",
  description: "Retrieve a stored API key by its name.",
  parameters: InputSchema,
  execute: async (args) => {
    const keyValue = db.getApiKey(args.keyName);
    
    if (!keyValue) {
      return {
        success: false,
        error: `API key '${args.keyName}' not found`
      };
    }
    
    return {
      success: true,
      keyName: args.keyName,
      keyValue: keyValue
    };
  }
};

export { get_api_key };

