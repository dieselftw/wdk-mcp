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
import { Textarea } from "@/components/ui/textarea"
import { createSeed } from "@/lib/actions/seeds"

export function CreateSeedDialog({ 
  open, 
  onOpenChange
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    seedId: "",
    name: "",
    description: "",
    seedphrase: "",
    chains: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await createSeed({
      seedId: formData.seedId,
      name: formData.name,
      type: "bip39",
      description: formData.description,
      seedphrase: formData.seedphrase || undefined,
      chains: formData.chains ? formData.chains.split(",").map(c => c.trim()) : undefined
    })
    
    setIsLoading(false)
    if (result.success) {
      onOpenChange(false)
      setFormData({
        seedId: "",
        name: "",
        description: "",
        seedphrase: "",
        chains: ""
      })
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Seed</DialogTitle>
          <DialogDescription>
            Add a new seed phrase to your collection
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seedId">Seed ID</Label>
            <Input
              id="seedId"
              value={formData.seedId}
              onChange={(e) => setFormData({ ...formData, seedId: e.target.value })}
              placeholder="my-seed"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Seed Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Main Recovery Seed"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Primary seed for all wallets"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seedphrase">Seed Phrase (optional)</Label>
            <Textarea
              id="seedphrase"
              value={formData.seedphrase}
              onChange={(e) => setFormData({ ...formData, seedphrase: e.target.value })}
              placeholder="word1 word2 word3..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to generate later. Will be encrypted when stored.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chains">Supported Chains (optional)</Label>
            <Input
              id="chains"
              value={formData.chains}
              onChange={(e) => setFormData({ ...formData, chains: e.target.value })}
              placeholder="ethereum, bitcoin, solana"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list of blockchain networks
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Seed"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

