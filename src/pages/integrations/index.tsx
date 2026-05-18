import { Sidebar } from "@/components/layout/sidebar"
import { IntegrationsList } from "./integrations-list"

export function IntegrationsPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto px-8 py-8 lg:px-12">
        <IntegrationsList />
      </main>
    </div>
  )
}
