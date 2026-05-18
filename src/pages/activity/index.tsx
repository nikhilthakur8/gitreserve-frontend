import { Sidebar } from "@/components/layout/sidebar"
import { ActivityList } from "./activity-list"

export function ActivityPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto px-8 py-8 lg:px-12">
        <ActivityList />
      </main>
    </div>
  )
}
