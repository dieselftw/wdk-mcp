import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, Key, MapPin } from "lucide-react"
import { getStats } from "@/lib/actions/stats"
import { getWallets } from "@/lib/actions/wallets"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const statsResult = await getStats()
  const walletsResult = await getWallets()
  
  const stats = statsResult.success ? statsResult.data : {
    walletCount: 0,
    seedCount: 0,
    apiKeyCount: 0,
    totalAddresses: 0
  }
  
  const wallets = walletsResult.success && walletsResult.data ? walletsResult.data : []
  const recentWallets = wallets.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your workspace.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/10 hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Wallets
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.walletCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across {stats?.seedCount || 0} seed{stats?.seedCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Seeds
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.seedCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                BIP39 seed phrases
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Keys</CardTitle>
              <Key className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.apiKeyCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                Encrypted and secure
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Addresses
              </CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAddresses || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all wallets
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Wallets</CardTitle>
              <CardDescription>
                Your most recently created wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentWallets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No wallets created yet
                  </p>
                  <Link href="/wallets">
                    <Button size="sm">Create Your First Wallet</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentWallets.map((wallet) => {
                    const timeAgo = new Date(wallet.createdAt).toLocaleDateString()
                    return (
                      <div key={wallet.id} className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-4 space-y-1 flex-1">
                          <p className="text-sm font-medium leading-none">{wallet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {wallet.type} • {wallet.addresses.length} address{wallet.addresses.length !== 1 ? 'es' : ''}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {timeAgo}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3 border-primary/10 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/wallets">
                  <button className="w-full rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-accent">
                    <CreditCard className="inline h-4 w-4 mr-2" />
                    Create new wallet
                  </button>
                </Link>
                <Link href="/seeds">
                  <button className="w-full rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-accent">
                    <Activity className="inline h-4 w-4 mr-2" />
                    Manage seed phrases
                  </button>
                </Link>
                <Link href="/apikeys">
                  <button className="w-full rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-accent">
                    <Key className="inline h-4 w-4 mr-2" />
                    Add API key
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
