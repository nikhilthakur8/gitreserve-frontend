import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ExternalLink,
  Lock,
  Globe,
  GitBranch,
  HardDrive,
  FolderArchive,
  Clock,
  Webhook,
  CalendarClock,
  RefreshCw,
  Pause,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GitCommitHorizontal,
  Zap,
  Calendar,
  Hand,
  Package,
  Upload,
  Copy,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProviderIcon } from "@/components/icons/provider-icon"
import { RepoStatusBadge } from "@/components/repos/repo-status-badge"
import { timeAgo } from "@/lib/time"
import { useAppDispatch, useAppSelector } from "@/store"
import { reposActions } from "@/store/slices/repos.slice"
import { activityActions } from "@/store/slices/activity.slice"
import { api } from "@/services/api"
import type { SyncJob, SyncJobStatus, SyncMode, TrackedRepoStatus } from "@/types/api"

export function RepoDetailPage() {
  const { repoId } = useParams<{ repoId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const repo = useAppSelector((s) => s.repos.items.find((r) => r.id === repoId))
  const syncing = useAppSelector((s) => s.repos.syncing[repoId!])
  const { jobs, loading: jobsLoading } = useAppSelector((s) => s.activity)
  const [editingMode, setEditingMode] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!repo) dispatch(reposActions.fetchReposRequest())
  }, [repo, dispatch])

  useEffect(() => {
    if (repoId) dispatch(activityActions.fetchJobsRequest(repoId))
  }, [repoId, dispatch])

  if (!repo) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
        </main>
      </div>
    )
  }

  const handleSync = () => dispatch(reposActions.syncRepoRequest(repo.id))

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await api.get(`/repositories/${repo.id}/download`, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(response.data as Blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${repo.source.name}.bundle`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("Download started")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: Blob } })?.response?.data
      if (msg instanceof Blob) {
        const text = await msg.text()
        try {
          const json = JSON.parse(text) as { error?: string }
          toast.error(json.error || "Download failed")
        } catch {
          toast.error("Download failed")
        }
      } else {
        toast.error("Download failed")
      }
    } finally {
      setDownloading(false)
    }
  }

  const handleTogglePause = () => {
    const newStatus: TrackedRepoStatus = repo.status === "paused" ? "active" : "paused"
    dispatch(reposActions.updateRepoRequest({ repoId: repo.id, status: newStatus }))
  }

  const handleSyncModeChange = (syncMode: SyncMode) => {
    dispatch(reposActions.updateRepoRequest({ repoId: repo.id, syncMode }))
    setEditingMode(false)
  }

  const completedJobs = jobs.filter((j) => j.status === "completed").length
  const failedJobs = jobs.filter((j) => j.status === "failed").length

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl px-8 py-8 lg:px-12">
          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Repositories
          </button>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <ProviderIcon provider={repo.providerType} />
                <a
                  href={repo.source.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-white hover:underline underline-offset-4 decoration-neutral-600 truncate"
                >
                  {repo.source.fullName}
                </a>
                <ExternalLink className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <RepoStatusBadge status={syncing ? "syncing" : repo.status} />
                <Badge variant="outline" className="gap-1">
                  {repo.source.private ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                  {repo.source.private ? "Private" : "Public"}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  {repo.syncMode === "webhook" ? <Webhook className="h-3 w-3" /> : <CalendarClock className="h-3 w-3" />}
                  {repo.syncMode === "webhook" ? "Webhook" : "Daily"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg border border-neutral-800 overflow-hidden mb-6">
            <MetaCell icon={<GitBranch className="h-3.5 w-3.5" />} label="Branch" value={repo.source.defaultBranch} />
            <MetaCell icon={<HardDrive className="h-3.5 w-3.5" />} label="Storage" value={repo.storageType.toUpperCase()} />
            <MetaCell icon={<Clock className="h-3.5 w-3.5" />} label="Last sync" value={repo.lastSyncedAt ? timeAgo(repo.lastSyncedAt) : "Never"} />
            <MetaCell icon={<Calendar className="h-3.5 w-3.5" />} label="Tracked" value={formatDate(repo.createdAt)} />
          </div>

          {repo.storagePath && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 px-1">
              <FolderArchive className="h-3.5 w-3.5 shrink-0" />
              <code className="font-mono text-neutral-400">{repo.storagePath}</code>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mb-8">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-neutral-200 gap-2"
              onClick={handleSync}
              disabled={syncing || repo.status === "paused"}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Trigger sync"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white gap-2"
              onClick={handleTogglePause}
            >
              {repo.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {repo.status === "paused" ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              onClick={() => setEditingMode(!editingMode)}
            >
              {editingMode ? "Cancel" : "Change sync mode"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white gap-2"
              onClick={() => void handleDownload()}
              disabled={downloading || !repo.lastSyncedAt}
            >
              <Download className={`h-3.5 w-3.5 ${downloading ? "animate-bounce" : ""}`} />
              {downloading ? "Downloading..." : "Download bundle"}
            </Button>
          </div>

          {/* Sync mode editor */}
          {editingMode && (
            <div className="mb-8 flex items-center gap-2">
              <button
                onClick={() => handleSyncModeChange("webhook")}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs transition-colors ${
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
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs transition-colors ${
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
            </div>
          )}

          {/* Stats bar */}
          {jobs.length > 0 && (
            <div className="flex items-center gap-6 mb-6 text-xs text-neutral-500">
              <span>{jobs.length} total {jobs.length === 1 ? "job" : "jobs"}</span>
              {completedJobs > 0 && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" />
                  {completedJobs} succeeded
                </span>
              )}
              {failedJobs > 0 && (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {failedJobs} failed
                </span>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-neutral-800 mb-6" />

          {/* Timeline header */}
          <h2 className="text-sm font-medium text-neutral-300 mb-6">Sync history</h2>

          {/* Timeline */}
          {jobsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-3 mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
                <RefreshCw className="h-4 w-4 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500">No sync jobs yet</p>
              <p className="text-xs text-neutral-600 mt-1">Trigger a sync or push to your repo to get started</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-neutral-800" />

              <div className="space-y-0">
                {jobs.map((job, i) => (
                  <TimelineEntry key={job.id} job={job} isLast={i === jobs.length - 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function MetaCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-neutral-950 px-4 py-3">
      <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-white font-medium truncate">{value}</p>
    </div>
  )
}

function TimelineEntry({ job, isLast }: { job: SyncJob; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const dotColor = getStatusDotColor(job.status)
  const isActive = job.status !== "completed" && job.status !== "failed"

  return (
    <div
      className={`relative pl-8 pb-6 group cursor-pointer ${isLast ? "pb-0" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Dot */}
      <div className={`absolute left-0 top-1 z-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 border-black bg-black`}>
        <div className={`h-2.5 w-2.5 rounded-full ${dotColor} ${isActive ? "animate-pulse" : ""}`} />
      </div>

      {/* Content */}
      <div className="rounded-lg border border-transparent hover:border-neutral-800 hover:bg-neutral-900/20 transition-all px-3 py-2 -mx-3 -my-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <JobStatusIcon status={job.status} />
            <span className="text-sm text-white font-medium capitalize">{job.status}</span>
            <TriggerBadge trigger={job.trigger} />
          </div>
          <span className="text-xs text-neutral-600 shrink-0">{timeAgo(job.createdAt)}</span>
        </div>

        {/* Commit info */}
        {job.metadata && (
          <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
            {job.metadata.commitSha && (
              <span className="flex items-center gap-1 font-mono">
                <GitCommitHorizontal className="h-3 w-3 text-neutral-600" />
                {job.metadata.commitSha.slice(0, 7)}
              </span>
            )}
            {job.metadata.branch && (
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3 text-neutral-600" />
                {job.metadata.branch}
              </span>
            )}
            {job.metadata.commitMessage && (
              <span className="truncate text-neutral-400">{job.metadata.commitMessage}</span>
            )}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-neutral-800/50 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {job.metadata?.commitAuthor && (
                <Detail label="Author" value={job.metadata.commitAuthor} />
              )}
              <Detail label="Duration" value={formatDuration(job)} />
              {job.startedAt && <Detail label="Started" value={formatTimestamp(job.startedAt)} />}
              {job.completedAt && <Detail label="Completed" value={formatTimestamp(job.completedAt)} />}
              {job.result?.sizeBytes && <Detail label="Bundle size" value={formatBytes(job.result.sizeBytes)} />}
              {job.result?.storageKey && (
                <Detail label="Storage key" value={job.result.storageKey} mono />
              )}
              {job.result?.checksum && (
                <Detail label="Checksum" value={job.result.checksum.slice(0, 16) + "..."} mono />
              )}
              <Detail label="Attempts" value={String(job.attempts)} />
            </div>

            {job.error && (
              <div className="mt-2 rounded-md bg-red-950/30 border border-red-900/30 px-3 py-2 text-red-400">
                {job.error}
              </div>
            )}

            {/* Step progress for active jobs */}
            {isActive && (
              <div className="mt-2 flex items-center gap-1">
                <StepIndicator label="Clone" active={job.status === "cloning"} done={stepDone(job.status, "cloning")} />
                <div className="h-px w-3 bg-neutral-800" />
                <StepIndicator label="Bundle" active={job.status === "bundling"} done={stepDone(job.status, "bundling")} />
                <div className="h-px w-3 bg-neutral-800" />
                <StepIndicator label="Upload" active={job.status === "uploading"} done={stepDone(job.status, "uploading")} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-neutral-600">{label}</span>
      <p className={`text-neutral-300 truncate ${mono ? "font-mono text-[11px]" : ""}`}>{value}</p>
    </div>
  )
}

function StepIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] ${
      active
        ? "border-blue-800 bg-blue-950/40 text-blue-400"
        : done
          ? "border-emerald-900 bg-emerald-950/30 text-emerald-500"
          : "border-neutral-800 text-neutral-600"
    }`}>
      {active ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : done ? <CheckCircle2 className="h-2.5 w-2.5" /> : <div className="h-2.5 w-2.5 rounded-full border border-neutral-700" />}
      {label}
    </div>
  )
}

function TriggerBadge({ trigger }: { trigger: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string }> = {
    webhook: { icon: <Zap className="h-3 w-3" />, label: "Webhook" },
    manual: { icon: <Hand className="h-3 w-3" />, label: "Manual" },
    scheduled: { icon: <Calendar className="h-3 w-3" />, label: "Scheduled" },
  }
  const c = config[trigger] ?? config.manual!
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-800/60 px-1.5 py-0.5 text-[10px] text-neutral-400">
      {c.icon}
      {c.label}
    </span>
  )
}

function JobStatusIcon({ status }: { status: SyncJobStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
    case "failed":
      return <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
    case "cloning":
      return <Copy className="h-3.5 w-3.5 text-blue-400 shrink-0 animate-pulse" />
    case "bundling":
      return <Package className="h-3.5 w-3.5 text-blue-400 shrink-0 animate-pulse" />
    case "uploading":
      return <Upload className="h-3.5 w-3.5 text-blue-400 shrink-0 animate-pulse" />
    default:
      return <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
  }
}

function getStatusDotColor(status: SyncJobStatus): string {
  switch (status) {
    case "completed": return "bg-emerald-500"
    case "failed": return "bg-red-500"
    case "pending": return "bg-amber-500"
    default: return "bg-blue-500"
  }
}

const STEP_ORDER: SyncJobStatus[] = ["pending", "cloning", "bundling", "uploading", "completed"]

function stepDone(current: SyncJobStatus, step: SyncJobStatus): boolean {
  return STEP_ORDER.indexOf(current) > STEP_ORDER.indexOf(step)
}

function formatDuration(job: SyncJob): string {
  let ms = job.result?.durationMs ?? null
  if (!ms && job.startedAt && job.completedAt) {
    ms = new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()
  }
  if (ms) {
    const s = ms / 1000
    if (s < 60) return `${s % 1 === 0 ? s : s.toFixed(1)}s`
    const m = Math.floor(s / 60)
    const rem = Math.round(s % 60)
    return `${m}m ${rem}s`
  }
  return "—"
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
