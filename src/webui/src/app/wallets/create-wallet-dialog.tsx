"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createWallet } from "@/lib/actions/wallets"

type Seed = {
  id: string
  name: string
}

export function CreateWalletDialog({ 
  open, 
  onOpenChange,
  seeds
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  seeds: Seed[]
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    walletId: "",
    name: "",
    seedRef: "",
    type: "ethereum",
    description: "",
    derivationPath: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await createWallet({
      ...formData,
      addresses: []
    })
    
    setIsLoading(false)
    if (result.success) {
      onOpenChange(false)
      setFormData({
        walletId: "",
        name: "",
        seedRef: "",
        type: "ethereum",
        description: "",
        derivationPath: ""
      })
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Wallet</DialogTitle>
          <DialogDescription>
            Add a new wallet to your collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletId">Wallet ID</Label>
            <Input
              id="walletId"
              value={formData.walletId}
              onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
              placeholder="my-wallet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Ethereum Wallet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seedRef">Seed</Label>
            <Select
              value={formData.seedRef}
              onValueChange={(value) => setFormData({ ...formData, seedRef: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a seed" />
              </SelectTrigger>
              <SelectContent>
                {seeds.map((seed) => (
                  <SelectItem key={seed.id} value={seed.id}>
                    {seed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Wallet Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="For DeFi operations"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="derivationPath">Derivation Path (optional)</Label>
            <Input
              id="derivationPath"
              value={formData.derivationPath}
              onChange={(e) => setFormData({ ...formData, derivationPath: e.target.value })}
              placeholder="m/44'/60'/0'/0/0"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Wallet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

