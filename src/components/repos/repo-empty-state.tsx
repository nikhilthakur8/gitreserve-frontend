import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RepoEmptyState() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900">
        <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2L4 7v9c0 7.73 5.12 14.96 12 17 6.88-2.04 12-9.27 12-17V7L16 2z"
            fill="white"
            fillOpacity="0.1"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-base font-medium text-white">No repositories yet</h3>
      <p className="mb-6 max-w-sm text-sm text-neutral-500">
        Connect a Git provider and start tracking repositories to back them up automatically.
      </p>
      <Button
        className="bg-white text-black hover:bg-neutral-200 gap-2"
        onClick={() => navigate("/repos/add")}
      >
        <Plus className="h-4 w-4" />
        Add repository
      </Button>
    </div>
  )
}
