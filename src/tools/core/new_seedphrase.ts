import { z } from "zod";
import { type WdkMcpTool } from "../../types/tool";
import WdkManager from "@tetherto/wdk";

const InputSchema = z.object({});

const new_seedphrase: WdkMcpTool<typeof InputSchema> = {
    name: "new_seedphrase",
    description: "Generate a new seed phrase without storing it. Just returns the seed phrase as it is.",
    parameters: InputSchema,
    execute: async (args) => {
        const seedPhrase = WdkManager.getRandomSeedPhrase();
        return seedPhrase;
    }
}

export { new_seedphrase };