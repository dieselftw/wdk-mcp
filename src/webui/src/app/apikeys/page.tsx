import { DashboardLayout } from "@/components/dashboard-layout"
import { ApiKeysClient } from "./apikeys-client"
import { getApiKeys } from "@/lib/actions/apikeys"

export default async function ApiKeysPage() {
  const result = await getApiKeys()
  const apiKeys = result.success ? result.data : []

  return (
    <DashboardLayout>
      <ApiKeysClient initialApiKeys={apiKeys} />
    </DashboardLayout>
  )
}

