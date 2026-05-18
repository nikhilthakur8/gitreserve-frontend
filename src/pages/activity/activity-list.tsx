import { useEffect } from "react"
import { Loader2, Activity } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { activityActions } from "@/store/slices/activity.slice"
import { JobRow } from "./job-row"

export function ActivityList() {
  const dispatch = useAppDispatch()
  const { jobs, loading } = useAppSelector((s) => s.activity)

  useEffect(() => {
    dispatch(activityActions.fetchJobsRequest(undefined))
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Recent sync jobs across all repositories</p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
            <Activity className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="mb-1 text-base font-medium text-white">No activity yet</h3>
          <p className="max-w-sm text-sm text-neutral-500">
            Sync jobs will appear here once you track repositories and push changes.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-800 overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_120px_100px] gap-4 px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/50 text-xs font-medium text-neutral-500 uppercase tracking-wider">
            <span>Repository</span>
            <span>Status</span>
            <span>Trigger</span>
            <span>Duration</span>
            <span>Time</span>
          </div>
          <div className="divide-y divide-neutral-800">
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
