import { useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/services/api"
import { useAppDispatch } from "@/store"
import { integrationsActions } from "@/store/slices/integrations.slice"
import type { IntegrationType } from "@/types/api"

export function OAuthCallbackPage({ type }: { type: IntegrationType }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const code = params.get("code")
    const state = params.get("state")
    const savedState = localStorage.getItem(`oauth_state_${type}`)

    localStorage.removeItem(`oauth_state_${type}`)

    if (!code || !state) {
      toast.error("OAuth failed: missing parameters")
      navigate("/integrations")
      return
    }

    if (state !== savedState) {
      toast.error("OAuth failed: state mismatch")
      navigate("/integrations")
      return
    }

    api
      .post(`/integrations/connect/${type}`, { code, state })
      .then(({ data }) => {
        dispatch(integrationsActions.connectSuccess(data))
        toast.success(`${type === "github" ? "GitHub" : "GitLab"} connected`)
        navigate("/integrations")
      })
      .catch(() => {
        toast.error("Failed to connect")
        navigate("/integrations")
      })
  }, [dispatch, navigate, params, type])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <p className="text-sm text-neutral-400">Connecting...</p>
      </div>
    </div>
  )
}
