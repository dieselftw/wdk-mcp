import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import type { WalletDatabase, SeedEntry, WalletEntry } from "./types";

// ============================================================================
// Encryption Stubs (to be implemented later)
// ============================================================================

function encrypt(data: string): string {
  // TODO: Implement encryption (e.g., AES-256-GCM)
  return data;
}

function decrypt(data: string): string {
  // TODO: Implement decryption
  return data;
}

// ============================================================================
// WalletConfigManager
// ============================================================================

export class WalletConfigManager {
  private configPath: string;
  private data: WalletDatabase;
  
  constructor(configPath?: string) {
    // Default to wdk-data.json in the project root
    this.configPath = configPath || join(process.cwd(), "wdk-data.json");
    this.data = this.load();
  }
  
  // ==========================================================================
  // Internal Methods
  // ==========================================================================
  
  private getEmptyDatabase(): WalletDatabase {
    return { seeds: {}, wallets: {}, apiKeys: {} };
  }
  
  private load(): WalletDatabase {
    if (!existsSync(this.configPath)) {
      const emptyDb = this.getEmptyDatabase();
      this.save(emptyDb);
      return emptyDb;
    }
    
    const fileContent = readFileSync(this.configPath, 'utf-8');
    return JSON.parse(fileContent);
  }
  
  private save(data?: WalletDatabase): void {
    const dataToSave = data || this.data;
    
    // Ensure directory exists
    const dir = dirname(this.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    // Atomic save: write to temp file, then rename
    const tempPath = `${this.configPath}.tmp`;
    writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    renameSync(tempPath, this.configPath);
  }
  
  private timestamp(): string {
    return new Date().toISOString();
  }
  
  // ==========================================================================
  // Seed
  // ==========================================================================
  
  createSeed(seedId: string, seed: Omit<SeedEntry, 'createdAt' | 'updatedAt'>): void {
    const now = this.timestamp();
    this.data.seeds[seedId] = {
      ...seed,
      seedphrase: seed.seedphrase ? encrypt(seed.seedphrase) : undefined,
      createdAt: now,
      updatedAt: now
    };
    this.save();
  }
  
  getSeed(seedId: string): SeedEntry | undefined {
    const seed = this.data.seeds[seedId];
    if (!seed) return undefined;
    
    return {
      ...seed,
      seedphrase: seed.seedphrase ? decrypt(seed.seedphrase) : undefined
    };
  }
  
  listSeeds(): Record<string, SeedEntry> {
    const seeds: Record<string, SeedEntry> = {};
    for (const [id, seed] of Object.entries(this.data.seeds)) {
      seeds[id] = {
        ...seed,
        seedphrase: seed.seedphrase ? decrypt(seed.seedphrase) : undefined
      };
    }
    return seeds;
  }
  
  updateSeed(seedId: string, updates: Partial<Omit<SeedEntry, 'createdAt' | 'updatedAt'>>): void {
    const existing = this.data.seeds[seedId];
    if (!existing) return;
    
    this.data.seeds[seedId] = {
      ...existing,
      ...updates,
      seedphrase: updates.seedphrase !== undefined 
        ? (updates.seedphrase ? encrypt(updates.seedphrase) : undefined)
        : existing.seedphrase,
      updatedAt: this.timestamp()
    };
    this.save();
  }
  
  deleteSeed(seedId: string): void {
    delete this.data.seeds[seedId];
    this.save();
  }
  
  // ==========================================================================
  // Wallet
  // ==========================================================================
  
  createWallet(walletId: string, wallet: Omit<WalletEntry, 'createdAt' | 'updatedAt'>): void {
    const now = this.timestamp();
    this.data.wallets[walletId] = {
      ...wallet,
      createdAt: now,
      updatedAt: now
    };
    
    // Add wallet reference to seed
    const seed = this.data.seeds[wallet.seedRef];
    if (seed) {
      if (!seed.wallets.includes(walletId)) {
        seed.wallets.push(walletId);
        seed.updatedAt = now;
      }
    }
    
    this.save();
  }
  
  getWallet(walletId: string): WalletEntry | undefined {
    return this.data.wallets[walletId];
  }
  
  listWallets(): Record<string, WalletEntry> {
    return { ...this.data.wallets };
  }
  
  listWalletsBySeed(seedId: string): Record<string, WalletEntry> {
    const wallets: Record<string, WalletEntry> = {};
    const seed = this.data.seeds[seedId];
    if (!seed) return wallets;
    
    for (const walletId of seed.wallets) {
      if (this.data.wallets[walletId]) {
        wallets[walletId] = this.data.wallets[walletId];
      }
    }
    return wallets;
  }
  
  updateWallet(walletId: string, updates: Partial<Omit<WalletEntry, 'createdAt' | 'updatedAt'>>): void {
    const oldWallet = this.data.wallets[walletId];
    if (!oldWallet) return;
    
    const now = this.timestamp();
    
    // Handle seedRef change
    if (updates.seedRef && updates.seedRef !== oldWallet.seedRef) {
      // Remove from old seed
      const oldSeed = this.data.seeds[oldWallet.seedRef];
      if (oldSeed) {
        const index = oldSeed.wallets.indexOf(walletId);
        if (index > -1) {
          oldSeed.wallets.splice(index, 1);
          oldSeed.updatedAt = now;
        }
      }
      
      // Add to new seed
      const newSeed = this.data.seeds[updates.seedRef];
      if (newSeed) {
        if (!newSeed.wallets.includes(walletId)) {
          newSeed.wallets.push(walletId);
          newSeed.updatedAt = now;
        }
      }
    }
    
    this.data.wallets[walletId] = {
      ...oldWallet,
      ...updates,
      updatedAt: now
    };
    this.save();
  }
  
  deleteWallet(walletId: string): void {
    const wallet = this.data.wallets[walletId];
    if (!wallet) return;
    
    // Remove wallet reference from seed
    const seed = this.data.seeds[wallet.seedRef];
    if (seed) {
      const index = seed.wallets.indexOf(walletId);
      if (index > -1) {
        seed.wallets.splice(index, 1);
        seed.updatedAt = this.timestamp();
      }
    }
    
    delete this.data.wallets[walletId];
    this.save();
  }
  
  // ==========================================================================
  // API Key
  // ==========================================================================
  
  setApiKey(keyName: string, keyValue: string): void {
    this.data.apiKeys[keyName] = encrypt(keyValue);
    this.save();
  }
  
  getApiKey(keyName: string): string | undefined {
    const encrypted = this.data.apiKeys[keyName];
    return encrypted ? decrypt(encrypted) : undefined;
  }
  
  listApiKeys(): string[] {
    return Object.keys(this.data.apiKeys);
  }
  
  deleteApiKey(keyName: string): void {
    delete this.data.apiKeys[keyName];
    this.save();
  }
  
  // ==========================================================================
  // Utilities
  // ==========================================================================
  
  reload(): void {
    this.data = this.load();
  }
  
  getConfigPath(): string {
    return this.configPath;
  }
  
  getStats() {
    return {
      seedCount: Object.keys(this.data.seeds).length,
      walletCount: Object.keys(this.data.wallets).length,
      apiKeyCount: Object.keys(this.data.apiKeys).length,
      configPath: this.configPath
    };
  }
}

// ============================================================================
// Instance
// ============================================================================

export const defaultManager = new WalletConfigManager();

export { encrypt, decrypt };
