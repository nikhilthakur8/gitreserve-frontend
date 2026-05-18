import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { integrationsActions } from "@/store/slices/integrations.slice"
import { GitProviderCard } from "./git-provider-card"
import { StorageCard } from "./storage-card"

export function IntegrationsList() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.integrations)

  useEffect(() => {
    dispatch(integrationsActions.fetchIntegrationsRequest())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </div>
    )
  }

  const github = items.find((i) => i.type === "github")
  const gitlab = items.find((i) => i.type === "gitlab")
  const s3 = items.find((i) => i.type === "s3")
  const r2 = items.find((i) => i.type === "r2")

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Connect your Git providers and storage backends
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Git Providers
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <GitProviderCard type="github" integration={github} />
            <GitProviderCard type="gitlab" integration={gitlab} />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Storage
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <StorageCard type="s3" integration={s3} />
            <StorageCard type="r2" integration={r2} />
          </div>
        </section>
      </div>
    </div>
  )
}
