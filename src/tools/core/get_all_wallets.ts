import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import { db } from "../../db/db";

const InputSchema = z.object({});

const get_all_wallets: WdkMcpTool<typeof InputSchema> = {
    name: "get_all_wallets",
    description: "Get all wallets from the database. Only returns the wallets, not the seed phrases.",
    parameters: InputSchema,
    execute: async (args) => {
        const wallets = db.getData().wallets;
        return wallets;
    }
}

export { get_all_wallets };