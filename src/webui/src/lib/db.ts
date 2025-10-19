// Re-export db from the parent folder
// Path from: src/webui/src/lib/db.ts -> src/db/index.ts
import { WalletConfigManager } from "../../../db/index"
import { join } from "path"

// Create a custom instance pointing to the correct wdk-data.json location
const projectRoot = join(process.cwd(), "../..")
const configPath = join(projectRoot, "wdk-data.json")

export const db = new WalletConfigManager(configPath)
export { WalletConfigManager }
export type { WalletDatabase, SeedEntry, WalletEntry } from "../../../db/types"

