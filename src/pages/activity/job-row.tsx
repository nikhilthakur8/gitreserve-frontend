import { CheckCircle2, Loader2, AlertCircle, Clock, GitBranch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { timeAgo } from "@/lib/time"
import type { SyncJob, SyncJobStatus } from "@/types/api"

function StatusBadge({ status }: { status: SyncJobStatus }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Done
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="error" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="h-3 w-3" />
          Queued
        </Badge>
      )
    default:
      return (
        <Badge variant="default" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          {status}
        </Badge>
      )
  }
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

export function JobRow({ job }: { job: SyncJob }) {
  return (
    <div className="grid grid-cols-[1fr_100px_100px_120px_100px] gap-4 px-4 py-3 items-center hover:bg-neutral-900/30 transition-colors">
      <div className="min-w-0">
        <p className="text-sm text-white truncate">{job.context.repoFullName}</p>
        {job.metadata?.branch && (
          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
            <GitBranch className="h-3 w-3" />
            {job.metadata.branch}
            {job.metadata.commitSha && (
              <span className="text-neutral-600 ml-1">
                {job.metadata.commitSha.slice(0, 7)}
              </span>
            )}
          </p>
        )}
      </div>
      <div>
        <StatusBadge status={job.status} />
      </div>
      <div>
        <span className="text-xs text-neutral-400 capitalize">{job.trigger}</span>
      </div>
      <div>
        <span className="text-xs text-neutral-400">{formatDuration(job)}</span>
      </div>
      <div>
        <span className="text-xs text-neutral-500">{timeAgo(job.createdAt)}</span>
      </div>
    </div>
  )
}
