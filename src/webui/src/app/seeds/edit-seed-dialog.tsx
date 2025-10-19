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
import { updateSeed } from "@/lib/actions/seeds"

type Seed = {
  id: string
  name: string
  description: string
  chains?: string[]
}

export function EditSeedDialog({ 
  open, 
  onOpenChange,
  seed
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  seed: Seed
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: seed.name,
    description: seed.description,
    chains: seed.chains?.join(", ") || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await updateSeed(seed.id, {
      ...formData,
      chains: formData.chains ? formData.chains.split(",").map(c => c.trim()) : undefined
    })
    
    setIsLoading(false)
    if (result.success) {
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Seed</DialogTitle>
          <DialogDescription>
            Update seed information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seed Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chains">Supported Chains</Label>
            <Input
              id="chains"
              value={formData.chains}
              onChange={(e) => setFormData({ ...formData, chains: e.target.value })}
              placeholder="ethereum, bitcoin, solana"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

