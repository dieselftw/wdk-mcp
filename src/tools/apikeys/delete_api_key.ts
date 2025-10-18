import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({
  keyName: z.string().describe("Name/identifier of the API key to delete")
});

const delete_api_key: WdkMcpTool<typeof InputSchema> = {
  name: "delete_api_key",
  description: "Delete a stored API key from the database.",
  parameters: InputSchema,
  execute: async (args) => {
    try {
      db.deleteApiKey(args.keyName);
      
      return {
        success: true,
        keyName: args.keyName,
        message: `API key '${args.keyName}' deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

export { delete_api_key };

