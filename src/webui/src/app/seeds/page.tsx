import { DashboardLayout } from "@/components/dashboard-layout"
import { SeedsClient } from "./seeds-client"
import { getSeeds } from "@/lib/actions/seeds"

export default async function SeedsPage() {
  const result = await getSeeds()
  const seeds = result.success ? result.data : []

  return (
    <DashboardLayout>
      <SeedsClient initialSeeds={seeds} />
    </DashboardLayout>
  )
}

