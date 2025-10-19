import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletsClient } from "./wallets-client"
import { getWallets } from "@/lib/actions/wallets"
import { getSeeds } from "@/lib/actions/seeds"

export default async function WalletsPage() {
  const walletsResult = await getWallets()
  const seedsResult = await getSeeds()
  
  const wallets = walletsResult.success ? walletsResult.data : []
  const seeds = seedsResult.success ? seedsResult.data : []

  return (
    <DashboardLayout>
      <WalletsClient initialWallets={wallets || []} seeds={seeds || []} />
    </DashboardLayout>
  )
}

