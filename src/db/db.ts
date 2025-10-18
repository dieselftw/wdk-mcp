/**
 * Database layer - exports the WalletConfigManager
 */

export { WalletConfigManager, getDefaultManager } from './walletConfigManager';
export type { WalletDatabase, SeedEntry, WalletEntry } from './types';

// Export the default manager instance as 'db' for convenience
import { getDefaultManager } from './walletConfigManager';
export const db = getDefaultManager();
