"use server"

import { db } from "@/lib/db"

export async function getStats() {
  try {
    const stats = db.getStats()
    const wallets = db.listWallets()
    
    const totalAddresses = Object.values(wallets).reduce(
      (sum, wallet) => sum + wallet.addresses.length, 
      0
    )
    
    return { 
      success: true, 
      data: {
        ...stats,
        totalAddresses
      }
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

