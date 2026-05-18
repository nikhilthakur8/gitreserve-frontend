import { CheckCircle2, Loader2, AlertCircle, PauseCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { TrackedRepoStatus } from "@/types/api"

export function RepoStatusBadge({ status }: { status: TrackedRepoStatus }) {
  switch (status) {
    case "active":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      )
    case "syncing":
      return (
        <Badge variant="default" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Syncing
        </Badge>
      )
    case "error":
      return (
        <Badge variant="error" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Error
        </Badge>
      )
    case "paused":
      return (
        <Badge variant="warning" className="gap-1">
          <PauseCircle className="h-3 w-3" />
          Paused
        </Badge>
      )
  }
}
