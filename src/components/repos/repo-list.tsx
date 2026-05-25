import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RepoCard } from "./repo-card"
import { RepoEmptyState } from "./repo-empty-state"
import { useAppDispatch, useAppSelector } from "@/store"
import { reposActions } from "@/store/slices/repos.slice"

export function RepoList() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: repos, loading } = useAppSelector((s) => s.repos)
  const [search, setSearch] = useState("")

  useEffect(() => {
    dispatch(reposActions.fetchReposRequest())
  }, [dispatch])

  const filtered = repos.filter(
    (r) =>
      r.source.name.toLowerCase().includes(search.toLowerCase()) ||
      r.source.fullName.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-6 w-36 rounded bg-neutral-800 animate-pulse" />
            <div className="h-4 w-48 rounded bg-neutral-800/60 animate-pulse mt-2" />
          </div>
          <div className="h-9 w-36 rounded-md bg-neutral-800 animate-pulse" />
        </div>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-neutral-800 rounded-lg p-5 animate-pulse">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded bg-neutral-800" />
                  <div className="h-4 w-44 rounded bg-neutral-800" />
                  <div className="h-3 w-3 rounded bg-neutral-800/60" />
                </div>
                <div className="h-5 w-16 rounded-full bg-neutral-800" />
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="h-3 w-24 rounded bg-neutral-800/60" />
                <div className="h-3 w-16 rounded bg-neutral-800/60" />
                <div className="h-3 w-20 rounded bg-neutral-800/60" />
                <div className="h-3 w-14 rounded bg-neutral-800/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Repositories</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {repos.length} {repos.length === 1 ? "repository" : "repositories"} tracked
          </p>
        </div>
        <Button
          className="bg-white text-black hover:bg-neutral-200 gap-2 self-start"
          onClick={() => navigate("/repos/add")}
        >
          <Plus className="h-4 w-4" />
          Add repository
        </Button>
      </div>

      {repos.length > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-neutral-800 bg-neutral-900/50 text-white placeholder:text-neutral-600 focus-visible:ring-neutral-600"
            />
          </div>
        </div>
      )}

      {repos.length === 0 ? (
        <RepoEmptyState />
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-neutral-500">No repositories match your search.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  )
}
