import { FastMCP } from "fastmcp";
import { z } from "zod";
import { get_all_wallets, new_seedphrase } from "./tools";
import { toFastMcpTool } from "./types/tool";
import { db } from "./db/db";

// 1. Initialize db
db.initialize();
console.log("WdkDb initialized");

// 2. Initialize server
const server = new FastMCP({
  name: "wdk-mcp",
  version: "1.0.0"
});

// 3. Add all our tools
const tools = [
    get_all_wallets,
    new_seedphrase
]

tools.forEach(tool => {
    server.addTool(toFastMcpTool(tool));
});

// 4. Start the server
server.start({
    transportType: "httpStream",
    httpStream: {
        port: 8080,
    },
});