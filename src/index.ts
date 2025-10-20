#!/usr/bin/env ts-node

import c from "ansi-colors";
import figlet from "figlet";
import ora from "ora";
import * as ngrok from "@ngrok/ngrok";
import { FastMCP } from "fastmcp";
import * as tools from "./tools/index.js";
import { toFastMcpTool } from "./types/tool.js";
import { db } from "./db/index.js";

// Determine environment
const isDev = process.env.NODE_ENV !== "production";

// Print banner
const printBanner = () => {
  const mode = isDev ? "💡 Development Mode" : "✨ Production Startup";
  console.log(c.cyan(figlet.textSync("WDK MCP", { font: "ANSI Shadow" })));
  console.log(c.gray(`${mode}\n`));
};

// Initialize database
const initDatabase = async () => {
  const spinner = ora("Initializing database...").start();
  const dbPath = db.getConfigPath();
  spinner.succeed(c.green(`Database ready at: ${dbPath}`));
};

// Start FastMCP server
const startFastMCP = async () => {
  const spinner = ora("Starting FastMCP server...").start();
  const server = new FastMCP({ name: "wdk-mcp", version: "1.0.0" });

  const toolList = [
    tools.create_seed, tools.list_seeds, tools.get_seed, tools.update_seed, tools.delete_seed,
    tools.create_wallet, tools.list_wallets, tools.get_wallet, tools.add_wallet_address,
    tools.update_wallet, tools.delete_wallet, tools.get_balance, tools.send_transaction,
    tools.set_api_key, tools.get_api_key, tools.list_api_keys, tools.delete_api_key,
    tools.get_database_stats,
  ];

  toolList.forEach((tool, index) => {
    if (!tool) {
      console.error(`Tool at index ${index} is undefined`);
      return;
    }
    server.addTool(toFastMcpTool(tool));
  });

  server.start({ transportType: "httpStream", httpStream: { port: 8080 } });
  spinner.succeed(c.green("🔥 FastMCP server running on http://localhost:8080"));
  return server;
};

// Optional ngrok setup
const startNgrok = async () => {
  if (!process.env.NGROK_AUTHTOKEN) return;
  const spinner = ora("Connecting ngrok tunnel...").start();
  try {
    const session = await ngrok.forward({ addr: 8080, authtoken: process.env.NGROK_AUTHTOKEN });
    spinner.succeed(c.yellowBright(`🌐 Public endpoint:\n   ${c.underline(session.url() + "/mcp" || "")}`));
  } catch (err : any) {
    console.error(c.red(`Ngrok failed: ${err.message}`));
  }
};

// Graceful shutdown handling
let shuttingDown = false;
const shutdown = async (code = 0, reason = "", server?: any) => {
  if (shuttingDown) return;
  shuttingDown = true;

  if (reason) console.log(c.red(`\n🛑 Shutting down: ${reason}`));
  try { await ngrok.kill(); } catch {}
  try { await server?.stop?.(); } catch {}

  process.exit(code);
};

// Register process signals
const registerProcessHandlers = (server: any) => {
  process.on("SIGINT", () => shutdown(0, "SIGINT", server));
  process.on("SIGTERM", () => shutdown(0, "SIGTERM", server));
  process.on("unhandledRejection", reason => {
    console.error(c.red("Unhandled rejection:"), reason);
    shutdown(1, "unhandledRejection", server);
  });
  process.on("uncaughtException", err => {
    console.error(c.red("Uncaught exception:"), err);
    shutdown(1, "uncaughtException", server);
  });
};

// Main logic
const main = async () => {
  printBanner();
  await initDatabase();
  const server = await startFastMCP();
  await startNgrok();
  registerProcessHandlers(server);
};

main().catch(err => {
  console.error(c.red("Fatal error:"), err);
  process.exit(1);
});
