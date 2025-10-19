"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getApiKeys() {
  try {
    const keyNames = db.listApiKeys()
    return { 
      success: true, 
      data: keyNames.map(name => ({ name }))
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getApiKey(keyName: string) {
  try {
    const value = db.getApiKey(keyName)
    if (!value) {
      return { success: false, error: "API key not found" }
    }
    return { success: true, data: { name: keyName, value } }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function setApiKey(keyName: string, keyValue: string) {
  try {
    db.setApiKey(keyName, keyValue)
    revalidatePath("/apikeys")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteApiKey(keyName: string) {
  try {
    db.deleteApiKey(keyName)
    revalidatePath("/apikeys")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

