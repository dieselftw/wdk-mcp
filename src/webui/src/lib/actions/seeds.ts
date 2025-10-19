"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSeeds() {
  try {
    const seeds = db.listSeeds()
    return { 
      success: true, 
      data: Object.entries(seeds).map(([id, seed]) => ({
        id,
        ...seed
      }))
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getSeed(seedId: string) {
  try {
    const seed = db.getSeed(seedId)
    if (!seed) {
      return { success: false, error: "Seed not found" }
    }
    return { success: true, data: { id: seedId, ...seed } }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function createSeed(data: {
  seedId: string
  name: string
  type: "bip39"
  description: string
  seedphrase?: string
  chains?: string[]
}) {
  try {
    db.createSeed(data.seedId, {
      name: data.name,
      type: data.type,
      description: data.description,
      seedphrase: data.seedphrase,
      chains: data.chains,
      wallets: []
    })
    revalidatePath("/seeds")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateSeed(seedId: string, updates: {
  name?: string
  description?: string
  chains?: string[]
  seedphrase?: string
}) {
  try {
    db.updateSeed(seedId, updates)
    revalidatePath("/seeds")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteSeed(seedId: string) {
  try {
    db.deleteSeed(seedId)
    revalidatePath("/seeds")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

