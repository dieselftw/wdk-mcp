/**
 * Database layer - exports the WalletConfigManager
 */

export { WalletConfigManager, defaultManager } from './walletConfigManager';
export type { WalletDatabase, SeedEntry, WalletEntry } from './types';

// Export the default manager instance as 'db' for convenience
import { defaultManager } from './walletConfigManager';
export const db = defaultManager;
