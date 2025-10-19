"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit, Wallet, RefreshCw, Copy, Check } from "lucide-react"
import { CreateWalletDialog } from "./create-wallet-dialog"
import { EditWalletDialog } from "./edit-wallet-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteWallet } from "@/lib/actions/wallets"
import { useRouter } from "next/navigation"

type Wallet = {
  id: string
  name: string
  seedRef: string
  type: string
  description?: string
  derivationPath?: string
  addresses: string[]
  createdAt: string
  updatedAt: string
}

type Seed = {
  id: string
  name: string
  type: string
  description: string
}

export function WalletsClient({ 
  initialWallets, 
  seeds 
}: { 
  initialWallets: Wallet[]
  seeds: Seed[]
}) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editWallet, setEditWallet] = useState<Wallet | null>(null)
  const [deleteWalletItem, setDeleteWalletItem] = useState<Wallet | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedAddresses, setCopiedAddresses] = useState<Set<string>>(new Set())

  const handleDelete = async () => {
    if (!deleteWalletItem) return
    setIsDeleting(true)
    const result = await deleteWallet(deleteWalletItem.id)
    setIsDeleting(false)
    if (result.success) {
      setDeleteWalletItem(null)
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
    setCopiedAddresses(new Set(copiedAddresses).add(id))
    setTimeout(() => {
      setCopiedAddresses(prev => {
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Wallets
          </h1>
          <p className="text-muted-foreground">
            Manage your cryptocurrency wallets
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
          <Button onClick={() => setCreateOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Wallet
          </Button>
        </div>
      </div>

      {initialWallets.length === 0 ? (
        <Card className="border-primary/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">No wallets yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first wallet to get started
            </p>
            <Button onClick={() => setCreateOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialWallets.map((wallet) => {
            const seed = seeds.find(s => s.id === wallet.seedRef)
            return (
              <Card key={wallet.id} className="border-primary/10 hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <Wallet className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{wallet.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 border-accent/40 text-accent">
                          {wallet.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="space-y-3 mb-4">
                    {wallet.description && (
                      <p className="text-sm text-foreground/70">{wallet.description}</p>
                    )}
                    <div className="text-xs space-y-2">
                      <div className="flex items-center justify-between py-1 px-2 rounded bg-muted/30">
                        <span className="text-muted-foreground">Seed:</span>
                        <span className="font-medium">{seed?.name || wallet.seedRef}</span>
                      </div>
                      {wallet.derivationPath && (
                        <div className="flex items-center justify-between py-1 px-2 rounded bg-muted/30">
                          <span className="text-muted-foreground">Path:</span>
                          <span className="font-mono text-xs">{wallet.derivationPath}</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <p className="text-muted-foreground mb-2">
                          Addresses ({wallet.addresses.length})
                        </p>
                        <div className="space-y-1">
                          {wallet.addresses.map((address, idx) => {
                            const copyId = `${wallet.id}-${idx}`
                            const isCopied = copiedAddresses.has(copyId)
                            return (
                              <div 
                                key={idx} 
                                className="flex items-center gap-2 p-2 rounded bg-muted/20 hover:bg-muted/40 transition-colors group"
                              >
                                <code className="flex-1 text-xs font-mono truncate">
                                  {address}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => copyToClipboard(address, copyId)}
                                >
                                  {isCopied ? (
                                    <Check className="h-3 w-3 text-primary" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardDescription>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-primary/20 hover:border-primary/40"
                      onClick={() => setEditWallet(wallet)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-destructive/20 text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                      onClick={() => setDeleteWalletItem(wallet)}
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

      <CreateWalletDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen}
        seeds={seeds}
      />

      {editWallet && (
        <EditWalletDialog
          open={!!editWallet}
          onOpenChange={(open) => !open && setEditWallet(null)}
          wallet={editWallet}
          seeds={seeds}
        />
      )}

      {deleteWalletItem && (
        <DeleteConfirmDialog
          open={!!deleteWalletItem}
          onOpenChange={(open) => !open && setDeleteWalletItem(null)}
          onConfirm={handleDelete}
          title="Delete Wallet"
          description={`Are you sure you want to delete "${deleteWalletItem.name}"? This action cannot be undone.`}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
