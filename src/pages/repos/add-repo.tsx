import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Search, Lock, Globe, Webhook, Clock, X, Server, Check } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/store"
import { availableReposActions } from "@/store/slices/available-repos.slice"
import { reposActions } from "@/store/slices/repos.slice"
import { integrationsActions } from "@/store/slices/integrations.slice"
import { ProviderIcon } from "@/components/icons/provider-icon"
import type { AvailableRepo, Integration, ProviderType, SyncMode } from "@/types/api"

export function AddRepoPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: available, loading } = useAppSelector((s) => s.availableRepos)
  const integrations = useAppSelector((s) => s.integrations.items)
  const [search, setSearch] = useState("")
  const [pendingRepo, setPendingRepo] = useState<AvailableRepo | null>(null)

  useEffect(() => {
    dispatch(integrationsActions.fetchIntegrationsRequest())
  }, [dispatch])

  const gitIntegrations = integrations.filter(
    (i) => (i.type === "github" || i.type === "gitlab") && i.status === "active",
  )
  const storageIntegrations = integrations.filter(
    (i) => (i.type === "s3" || i.type === "r2") && i.status === "active",
  )

  const defaultStorage = storageIntegrations.length === 1 ? storageIntegrations[0]!.id : null
  const defaultProvider = gitIntegrations.length > 0 ? (gitIntegrations[0]!.type as ProviderType) : null

  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null)
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null)

  const activeProvider = selectedProvider ?? defaultProvider
  const activeStorage = selectedStorage ?? defaultStorage

  const providerInitialized = useRef(false)
  useEffect(() => {
    if (defaultProvider && !providerInitialized.current) {
      providerInitialized.current = true
      dispatch(availableReposActions.fetchAvailableRequest(defaultProvider))
    }
  }, [defaultProvider, dispatch])

  const handleProviderChange = (type: ProviderType) => {
    setSelectedProvider(type)
    dispatch(availableReposActions.fetchAvailableRequest(type))
  }

  const handleTrack = (syncMode: SyncMode) => {
    if (!pendingRepo || !activeStorage) return

    const gitIntegration = integrations.find(
      (i) => i.type === activeProvider && i.status === "active",
    )

    if (!gitIntegration) return

    dispatch(
      reposActions.trackRepoRequest({
        integrationId: gitIntegration.id,
        storageIntegrationId: activeStorage,
        externalRepoId: pendingRepo.id,
        syncMode,
      }),
    )
    setPendingRepo(null)
    navigate("/dashboard")
  }

  const filtered = available.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.fullName.toLowerCase().includes(search.toLowerCase()),
  )

  const hasNoIntegrations = gitIntegrations.length === 0 || storageIntegrations.length === 0

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto px-8 py-8 lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight">Add Repository</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Select a repository to back up automatically
            </p>
          </div>

          {hasNoIntegrations ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-8 text-center">
              <p className="text-sm text-neutral-400 mb-4">
                {gitIntegrations.length === 0
                  ? "Connect a Git provider first to see your repositories."
                  : "Connect a storage backend (S3 or R2) to store your backups."}
              </p>
              <Button
                className="bg-white text-black hover:bg-neutral-200"
                onClick={() => navigate("/integrations")}
              >
                Go to Integrations
              </Button>
            </div>
          ) : (
            <>
              {storageIntegrations.length > 1 && (
                <div className="mb-4">
                  <p className="text-xs text-neutral-400 mb-2">Storage backend</p>
                  <div className="flex items-center gap-2">
                    {storageIntegrations.map((s) => (
                      <StorageOption
                        key={s.id}
                        integration={s}
                        selected={activeStorage === s.id}
                        onSelect={() => setSelectedStorage(s.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center gap-2">
                {gitIntegrations.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => handleProviderChange(i.type as ProviderType)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      activeProvider === i.type
                        ? "border-neutral-600 bg-neutral-800 text-white"
                        : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    <ProviderIcon provider={i.type as ProviderType} />
                    {i.type === "github" ? "GitHub" : "GitLab"}
                  </button>
                ))}
              </div>

              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search repositories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-neutral-800 bg-neutral-900/50 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-600"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
                </div>
              ) : (
                <div className="rounded-lg border border-neutral-800 divide-y divide-neutral-800 max-h-[500px] overflow-auto">
                  {filtered.map((repo) => (
                    <RepoRow
                      key={repo.id}
                      repo={repo}
                      isPending={pendingRepo?.id === repo.id}
                      storageSelected={!!activeStorage}
                      onSelect={() => setPendingRepo(repo)}
                      onCancel={() => setPendingRepo(null)}
                      onTrack={handleTrack}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div className="py-8 text-center text-sm text-neutral-500">
                      No repositories found
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function StorageOption({
  integration,
  selected,
  onSelect,
}: {
  integration: Integration
  selected: boolean
  onSelect: () => void
}) {
  const label = integration.type === "s3" ? "AWS S3" : "Cloudflare R2"

  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
        selected
          ? "border-white/20 bg-white/5 text-white"
          : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
      }`}
    >
      <Server className="h-4 w-4" />
      <span>{label}</span>
      {selected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
    </button>
  )
}

function RepoRow({
  repo,
  isPending,
  storageSelected,
  onSelect,
  onCancel,
  onTrack,
}: {
  repo: AvailableRepo
  isPending: boolean
  storageSelected: boolean
  onSelect: () => void
  onCancel: () => void
  onTrack: (mode: SyncMode) => void
}) {
  return (
    <div className="px-4 py-3 hover:bg-neutral-900/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {repo.private ? (
              <Lock className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            ) : (
              <Globe className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            )}
            <span className="text-sm text-white truncate">{repo.fullName}</span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 ml-5.5">{repo.defaultBranch}</p>
        </div>
        {!isPending && (
          <Button
            size="sm"
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white shrink-0"
            onClick={onSelect}
            disabled={!storageSelected}
          >
            Track
          </Button>
        )}
        {isPending && (
          <button
            onClick={onCancel}
            className="p-1 rounded text-neutral-500 hover:text-white transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isPending && (
        <div className="mt-3 ml-5.5">
          <p className="text-xs text-neutral-400 mb-2">Choose sync mode:</p>
          <div className="flex gap-2">
            <button
              onClick={() => onTrack("webhook")}
              className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
            >
              <Webhook className="h-3.5 w-3.5" />
              <div className="text-left">
                <p className="font-medium">Webhook</p>
                <p className="text-[10px] text-neutral-500">Real-time on every push</p>
              </div>
            </button>
            <button
              onClick={() => onTrack("daily")}
              className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
            >
              <Clock className="h-3.5 w-3.5" />
              <div className="text-left">
                <p className="font-medium">Daily</p>
                <p className="text-[10px] text-neutral-500">Scheduled once per day</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
