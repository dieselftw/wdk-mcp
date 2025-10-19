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
import { setApiKey } from "@/lib/actions/apikeys"

export function CreateApiKeyDialog({ 
  open, 
  onOpenChange
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    keyName: "",
    keyValue: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const result = await setApiKey(formData.keyName, formData.keyValue)
    
    setIsLoading(false)
    if (result.success) {
      onOpenChange(false)
      setFormData({
        keyName: "",
        keyValue: ""
      })
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Add a new API key to your collection. The value will be encrypted.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              id="keyName"
              value={formData.keyName}
              onChange={(e) => setFormData({ ...formData, keyName: e.target.value })}
              placeholder="openai-api-key"
              required
            />
            <p className="text-xs text-muted-foreground">
              A unique identifier for this API key
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keyValue">Key Value</Label>
            <Input
              id="keyValue"
              type="password"
              value={formData.keyValue}
              onChange={(e) => setFormData({ ...formData, keyValue: e.target.value })}
              placeholder="sk-..."
              required
            />
            <p className="text-xs text-muted-foreground">
              The actual API key or token (will be encrypted)
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create API Key"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

