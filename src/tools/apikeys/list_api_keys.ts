import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db";

const InputSchema = z.object({});

const list_api_keys: WdkMcpTool<typeof InputSchema> = {
  name: "list_api_keys",
  description: "List all stored API key names (not the actual values for security).",
  parameters: InputSchema,
  execute: async (args) => {
    const keyNames = db.listApiKeys();
    
    return {
      count: keyNames.length,
      keys: keyNames
    };
  }
};

export { list_api_keys };

