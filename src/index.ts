import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as tools from "./tools";
import { toFastMcpTool } from "./types/tool";
import { db } from "./db";

// 1. Initialize db (auto-initializes on first access)
console.log(`Database initialized at: ${db.getConfigPath()}`);

// 2. Initialize server
const server = new FastMCP({
  name: "wdk-mcp",
  version: "1.0.0"
});

// 3. Add all tools
const allTools = [
  // Seed Management
  tools.create_seed,
  tools.list_seeds,
  tools.get_seed,
  tools.update_seed,
  tools.delete_seed,
  
  // Wallet Management
  tools.create_wallet,
  tools.list_wallets,
  tools.get_wallet,
  tools.add_wallet_address,
  tools.update_wallet,
  tools.delete_wallet,
  
  // API Key Management
  tools.set_api_key,
  tools.get_api_key,
  tools.list_api_keys,
  tools.delete_api_key,
  
  // Utilities
  tools.get_database_stats,
];

allTools.forEach(tool => {
  server.addTool(toFastMcpTool(tool));
});

console.log(`✅ Registered ${allTools.length} tools`);

// 4. Start the server
server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8080,
  },
});

console.log(`🚀 WDK MCP Server running on http://localhost:8080`);
