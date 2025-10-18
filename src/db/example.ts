/**
 * Simple usage example for WalletConfigManager
 * 
 * Database is stored in wdk-data.json in the project root
 */

import { getDefaultManager } from './walletConfigManager';

// Get the default manager instance (uses wdk-data.json)
const manager = getDefaultManager();

// Create a seed
manager.createSeed('my-seed', {
  name: 'My Main Seed',
  type: 'bip39',
  description: 'Production seed',
  chains: ['ethereum', 'bitcoin'],
  wallets: [],
  seedphrase: 'your seed phrase here'
});

// Create a wallet
manager.createWallet('eth-wallet', {
  name: 'Ethereum Wallet',
  seedRef: 'my-seed',
  type: 'ethereum',
  derivationPath: "m/44'/60'/0'/0/0",
  addresses: ['0x123...'],
  networks: {
    mainnet: {
      rpc: 'https://eth.llamarpc.com',
      chainId: 1
    }
  }
});

// Get a wallet
const wallet = manager.getWallet('eth-wallet');
console.log(wallet?.name);

// List all wallets for a seed
const wallets = manager.listWalletsBySeed('my-seed');
console.log('Wallets:', Object.keys(wallets));

// Update a wallet
manager.updateWallet('eth-wallet', {
  addresses: ['0x123...', '0x456...']
});

// Set an API key
manager.setApiKey('alchemy', 'your-api-key');

// Get stats
const stats = manager.getStats();
console.log(`Database: ${stats.walletCount} wallets, ${stats.seedCount} seeds`);

