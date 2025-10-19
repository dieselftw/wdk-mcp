"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Key, Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react"
import { CreateApiKeyDialog } from "./create-apikey-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteApiKey, getApiKey } from "@/lib/actions/apikeys"
import { useRouter } from "next/navigation"

type ApiKey = {
  name: string
}

export function ApiKeysClient({ initialApiKeys }: { initialApiKeys: ApiKey[] }) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteKeyItem, setDeleteKeyItem] = useState<ApiKey | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({})
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({})
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDelete = async () => {
    if (!deleteKeyItem) return
    setIsDeleting(true)
    const result = await deleteApiKey(deleteKeyItem.name)
    setIsDeleting(false)
    if (result.success) {
      setDeleteKeyItem(null)
      router.refresh()
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleReveal = async (keyName: string) => {
    if (revealedKeys[keyName]) {
      const newRevealed = { ...revealedKeys }
      delete newRevealed[keyName]
      setRevealedKeys(newRevealed)
      return
    }

    setLoadingKeys({ ...loadingKeys, [keyName]: true })
    const result = await getApiKey(keyName)
    setLoadingKeys({ ...loadingKeys, [keyName]: false })
    
    if (result.success && result.data) {
      setRevealedKeys({ ...revealedKeys, [keyName]: result.data.value })
    }
  }

  const handleCopy = (value: string, keyName: string) => {
    navigator.clipboard.writeText(value)
    setCopiedKeys(new Set(copiedKeys).add(keyName))
    setTimeout(() => {
      setCopiedKeys(prev => {
        const next = new Set(prev)
        next.delete(keyName)
        return next
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-200">
            API Keys
          </h1>
          <p className="text-muted-foreground">
            Manage your API keys and access tokens
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-primary/20 hover:border-primary/40 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="bg-gray-300 hover:bg-primary/90 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </div>
      </div>

      {initialApiKeys.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first API key to start integrating
            </p>
            <Button onClick={() => setCreateOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Your API keys are encrypted and stored securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {initialApiKeys.map((apiKey) => {
                const isCopied = copiedKeys.has(apiKey.name)
                return (
                  <div key={apiKey.name} className="flex items-center justify-between border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{apiKey.name}</p>
                        {revealedKeys[apiKey.name] ? (
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-muted/30 px-2 py-1 rounded font-mono truncate max-w-md border border-primary/10">
                              {revealedKeys[apiKey.name]}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleCopy(revealedKeys[apiKey.name], apiKey.name)}
                            >
                              {isCopied ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">••••••••••••••••</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReveal(apiKey.name)}
                        disabled={loadingKeys[apiKey.name]}
                        className="border-primary/20 hover:border-primary/40"
                      >
                        {revealedKeys[apiKey.name] ? (
                          <EyeOff className="h-3 w-3 mr-1" />
                        ) : (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        {revealedKeys[apiKey.name] ? "Hide" : "Reveal"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-destructive/20 text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                        onClick={() => setDeleteKeyItem(apiKey)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <CreateApiKeyDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen}
      />

      {deleteKeyItem && (
        <DeleteConfirmDialog
          open={!!deleteKeyItem}
          onOpenChange={(open) => !open && setDeleteKeyItem(null)}
          onConfirm={handleDelete}
          title="Delete API Key"
          description={`Are you sure you want to delete the API key "${deleteKeyItem.name}"? This action cannot be undone and may break integrations using this key.`}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
