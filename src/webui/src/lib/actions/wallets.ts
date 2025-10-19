"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getWallets(seedId?: string) {
  try {
    const wallets = seedId ? db.listWalletsBySeed(seedId) : db.listWallets()
    return { 
      success: true, 
      data: Object.entries(wallets).map(([id, wallet]) => ({
        id,
        ...wallet
      }))
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getWallet(walletId: string) {
  try {
    const wallet = db.getWallet(walletId)
    if (!wallet) {
      return { success: false, error: "Wallet not found" }
    }
    return { success: true, data: { id: walletId, ...wallet } }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function createWallet(data: {
  walletId: string
  name: string
  seedRef: string
  type: string
  description?: string
  derivationPath?: string
  addresses?: string[]
}) {
  try {
    db.createWallet(data.walletId, {
      name: data.name,
      seedRef: data.seedRef,
      type: data.type,
      description: data.description,
      derivationPath: data.derivationPath,
      addresses: data.addresses || []
    })
    revalidatePath("/wallets")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateWallet(walletId: string, updates: {
  name?: string
  description?: string
  derivationPath?: string
  type?: string
}) {
  try {
    db.updateWallet(walletId, updates)
    revalidatePath("/wallets")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteWallet(walletId: string) {
  try {
    db.deleteWallet(walletId)
    revalidatePath("/wallets")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function addWalletAddress(walletId: string, address: string) {
  try {
    const wallet = db.getWallet(walletId)
    if (!wallet) {
      return { success: false, error: "Wallet not found" }
    }
    
    const addresses = [...wallet.addresses, address]
    db.updateWallet(walletId, { addresses })
    revalidatePath("/wallets")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

