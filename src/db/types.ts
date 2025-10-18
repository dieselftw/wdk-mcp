/**
 * Database type definitions for wallet configuration
 */

export interface WalletDatabase {
  seeds: Record<string, SeedEntry>;
  wallets: Record<string, WalletEntry>;
  apiKeys: Record<string, string>;
}

export interface SeedEntry {
  name: string;
  type: 'bip39';
  description: string;
  chains?: string[];
  wallets: string[];
  seedphrase?: string; // to be encrypted later
  createdAt: string;
  updatedAt: string;
}

export interface WalletEntry {
  name: string;
  seedRef: string;
  type: 'ethereum' | 'bitcoin' | string;
  description?: string;
  derivationPath?: string;
  addresses: string[];
  networks?: Record<string, { rpc: string; chainId?: number }>;
  createdAt: string;
  updatedAt: string;
}

