## WDK MCP

Local-first MCP server for wallet development. Provides seed and wallet management, balance reads, and transaction sending — all on your machine. You can optionally expose the MCP endpoint via ngrok for remote LLMs. Seed phrases never leave your machine. 🔒

### Features
- **Seed management**: create, read, update, delete; wallets reference seeds
- **Wallet management**: create, list, read, update, delete; add addresses
- **Balances**: fetch balance for an address via configured network
- **Transactions**: send transactions from a managed wallet
- **Local-first**: state stored in `wdk-data.json` at the project root
- **Privacy**: seed phrases are not sent to LLMs or remote services
- **Optional ngrok**: expose `http://localhost:8080/mcp` to remote LLM providers

### Requirements
- Bun (recommended latest)
- Optionally: `NGROK_AUTHTOKEN` if you want remote access

### Setup
```bash
# Install dependencies
bun install

# (Optional) set ngrok auth token to expose publicly
export NGROK_AUTHTOKEN="<your-token>"
```

### Run
```bash
# Start the MCP server
bun run src/index.ts
```

Server will listen at `http://localhost:8080/mcp`.

### Web UI (optional)
A lightweight Next.js dashboard is included for managing seeds and wallets. 🖥️

```bash
cd src/webui
bun install
bun run dev
```

Then open `http://localhost:3000`.

### Verify
- On startup you should see a banner and a line with: `FastMCP server running on http://localhost:8080`
- Data file path is logged as: `Database ready at: <path>/wdk-data.json`

### Data Model
- Stored in `wdk-data.json`
- Top-level keys: `seeds`, `wallets`, `apiKeys`
- Designed for local development; simple JSON store

### Tools Reference
- **create_seed**: create a new seed entry
- **list_seeds**: list all seeds
- **get_seed**: fetch a seed by id
- **update_seed**: update seed metadata/phrase
- **delete_seed**: remove a seed

- **create_wallet**: create a wallet linked to a seed
- **list_wallets**: list all wallets
- **get_wallet**: fetch a wallet by id
- **add_wallet_address**: attach an address to a wallet
- **update_wallet**: update wallet metadata
- **delete_wallet**: remove a wallet
- **get_balance**: get balance for a specific address
- **send_transaction**: send a transaction from a wallet

- **set_api_key**: store an API key locally
- **get_api_key**: retrieve a stored API key
- **list_api_keys**: list stored API keys
- **delete_api_key**: delete an API key

- **get_database_stats**: basic counts and config path

### Limitations
- Data store is a plain JSON file and not encrypted at rest (yet) ⚠️
- EVM/ETH-focused flows only; other chains not supported out of the box
- No bridging or cross-chain protocols
- Basic RPC provider configuration; no advanced retry/backoff logic
- Minimal validation; use in dev environments only

### Notes
- Use Bun for all scripts and execution.
- If the port `8080` is in use, stop the other process or change the port in `src/index.ts`.


