import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  MoreVertical,
  RefreshCw,
  ExternalLink,
  Trash2,
  Clock,
  Lock,
  Globe,
  Webhook,
  CalendarClock,
  GitBranch,
  HardDrive,
  FolderArchive,
  Pencil,
  Pause,
  Play,
} from "lucide-react"
import { ProviderIcon } from "@/components/icons/provider-icon"
import { RepoStatusBadge } from "./repo-status-badge"
import { Button } from "@/components/ui/button"
import { timeAgo } from "@/lib/time"
import { useAppDispatch, useAppSelector } from "@/store"
import { reposActions } from "@/store/slices/repos.slice"
import type { TrackedRepo, SyncMode, TrackedRepoStatus } from "@/types/api"

export function RepoCard({ repo }: { repo: TrackedRepo }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const syncing = useAppSelector((s) => s.repos.syncing[repo.id])
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleSync = () => {
    dispatch(reposActions.syncRepoRequest(repo.id))
    setMenuOpen(false)
  }

  const handleRemove = () => {
    dispatch(reposActions.untrackRepoRequest(repo.id))
    setMenuOpen(false)
  }

  const handleEdit = () => {
    setEditing(true)
    setMenuOpen(false)
  }

  const handleTogglePause = () => {
    const newStatus: TrackedRepoStatus = repo.status === "paused" ? "active" : "paused"
    dispatch(reposActions.updateRepoRequest({ repoId: repo.id, status: newStatus }))
    setMenuOpen(false)
  }

  const handleSyncModeChange = (syncMode: SyncMode) => {
    dispatch(reposActions.updateRepoRequest({ repoId: repo.id, syncMode }))
    setEditing(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest("a") || editing) return
    navigate(`/repos/${repo.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative border border-neutral-800 rounded-lg p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/30 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <ProviderIcon provider={repo.providerType} />
            <a
              href={repo.source.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white truncate hover:underline underline-offset-2"
            >
              {repo.source.fullName}
            </a>
            {repo.source.private ? (
              <Lock className="h-3 w-3 text-neutral-500 shrink-0" />
            ) : (
              <Globe className="h-3 w-3 text-neutral-500 shrink-0" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <RepoStatusBadge status={syncing ? "syncing" : repo.status} />
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }} />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-neutral-800 bg-neutral-900 p-1 shadow-xl">
                  <DropdownItem icon={<RefreshCw className="h-3.5 w-3.5" />} label="Trigger sync" onClick={handleSync} />
                  <DropdownItem icon={<Pencil className="h-3.5 w-3.5" />} label="Edit" onClick={handleEdit} />
                  <DropdownItem
                    icon={repo.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                    label={repo.status === "paused" ? "Resume" : "Pause"}
                    onClick={handleTogglePause}
                  />
                  <DropdownItem
                    icon={<ExternalLink className="h-3.5 w-3.5" />}
                    label={`View on ${repo.providerType === "github" ? "GitHub" : "GitLab"}`}
                    onClick={() => { window.open(repo.source.htmlUrl, "_blank"); setMenuOpen(false) }}
                  />
                  <div className="my-1 h-px bg-neutral-800" />
                  <DropdownItem icon={<Trash2 className="h-3.5 w-3.5" />} label="Remove" destructive onClick={handleRemove} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {repo.lastSyncedAt ? `Synced ${timeAgo(repo.lastSyncedAt)}` : "Never synced"}
        </span>
        <span className="flex items-center gap-1.5">
          <GitBranch className="h-3 w-3" />
          {repo.source.defaultBranch}
        </span>
        <span className="flex items-center gap-1.5">
          {repo.syncMode === "webhook" ? (
            <Webhook className="h-3 w-3" />
          ) : (
            <CalendarClock className="h-3 w-3" />
          )}
          {repo.syncMode === "webhook" ? "Webhook" : "Daily"}
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive className="h-3 w-3" />
          {repo.storageType.toUpperCase()}
        </span>
        {repo.storagePath && (
          <span className="flex items-center gap-1.5 text-neutral-600">
            <FolderArchive className="h-3 w-3" />
            <span className="truncate max-w-[180px]">{repo.storagePath}</span>
          </span>
        )}
      </div>

      {editing && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-400 mb-3">Sync mode</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSyncModeChange("webhook")}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                repo.syncMode === "webhook"
                  ? "border-white/20 bg-white/5 text-white"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
              }`}
            >
              <Webhook className="h-3.5 w-3.5" />
              <div className="text-left">
                <p className="font-medium">Webhook</p>
                <p className="text-[10px] text-neutral-500">Real-time on every push</p>
              </div>
            </button>
            <button
              onClick={() => handleSyncModeChange("daily")}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                repo.syncMode === "daily"
                  ? "border-white/20 bg-white/5 text-white"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
              }`}
            >
              <CalendarClock className="h-3.5 w-3.5" />
              <div className="text-left">
                <p className="font-medium">Daily</p>
                <p className="text-[10px] text-neutral-500">Scheduled once per day</p>
              </div>
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-neutral-500 hover:text-white"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownItem({ icon, label, destructive, onClick }: { icon: React.ReactNode; label: string; destructive?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
        destructive
          ? "text-red-400 hover:bg-red-950/50 hover:text-red-300"
          : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
