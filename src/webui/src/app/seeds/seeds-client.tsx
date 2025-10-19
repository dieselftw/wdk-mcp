"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit, Sprout, RefreshCw, Copy, Check } from "lucide-react"
import { CreateSeedDialog } from "./create-seed-dialog"
import { EditSeedDialog } from "./edit-seed-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteSeed } from "@/lib/actions/seeds"
import { useRouter } from "next/navigation"

type Seed = {
  id: string
  name: string
  type: string
  description: string
  chains?: string[]
  wallets: string[]
  seedphrase?: string
  createdAt: string
  updatedAt: string
}

export function SeedsClient({ initialSeeds }: { initialSeeds: Seed[] }) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editSeed, setEditSeed] = useState<Seed | null>(null)
  const [deleteSeedItem, setDeleteSeedItem] = useState<Seed | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedSeeds, setCopiedSeeds] = useState<Set<string>>(new Set())

  const handleDelete = async () => {
    if (!deleteSeedItem) return
    setIsDeleting(true)
    const result = await deleteSeed(deleteSeedItem.id)
    setIsDeleting(false)
    if (result.success) {
      setDeleteSeedItem(null)
      router.refresh()
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSeeds(new Set(copiedSeeds).add(id))
    setTimeout(() => {
      setCopiedSeeds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-200">
            Seeds
          </h1>
          <p className="text-muted-foreground">
            Manage your seed phrases and recovery keys
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-primary/20 hover:border-primary/40"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="bg-gray-300 hover:bg-primary/90 cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Create Seed
          </Button>
        </div>
      </div>

      {initialSeeds.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">No seeds yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first seed to start managing wallets
            </p>
            <Button onClick={() => setCreateOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Seed
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialSeeds.map((seed) => {
            const isCopied = copiedSeeds.has(seed.id)
            return (
              <Card key={seed.id} className="border-primary/10 hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border">
                        <Sprout className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{seed.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 border-accent/40 text-accent">
                          {seed.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="space-y-3 mb-4">
                    {seed.description && (
                      <p className="text-sm text-foreground/70">{seed.description}</p>
                    )}
                    <div className="text-xs space-y-2">
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-muted/30">
                        <span className="text-muted-foreground">Wallets:</span>
                        <span className="font-medium">{seed.wallets.length}</span>
                      </div>
                      {seed.chains && seed.chains.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Chains:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {seed.chains.map((chain, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {chain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {seed.seedphrase && (
                        <div className="pt-2">
                          <p className="text-muted-foreground mb-2">Seed Phrase</p>
                          <div className="flex items-start gap-2 p-2 rounded bg-muted/20 hover:bg-muted/40 transition-colors group">
                            <code className="flex-1 text-xs font-mono break-all">
                              {seed.seedphrase}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(seed.seedphrase!, seed.id)}
                            >
                              {isCopied ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardDescription>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-primary/20 hover:border-primary/40"
                      onClick={() => setEditSeed(seed)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-destructive/20 text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                      onClick={() => setDeleteSeedItem(seed)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <CreateSeedDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen}
      />

      {editSeed && (
        <EditSeedDialog
          open={!!editSeed}
          onOpenChange={(open) => !open && setEditSeed(null)}
          seed={editSeed}
        />
      )}

      {deleteSeedItem && (
        <DeleteConfirmDialog
          open={!!deleteSeedItem}
          onOpenChange={(open) => !open && setDeleteSeedItem(null)}
          onConfirm={handleDelete}
          title="Delete Seed"
          description={`Are you sure you want to delete "${deleteSeedItem.name}"? This will also affect ${deleteSeedItem.wallets.length} associated wallet(s).`}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
