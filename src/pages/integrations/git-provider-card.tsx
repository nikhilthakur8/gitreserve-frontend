import { useState } from "react"
import { CheckCircle2, ExternalLink, Loader2, Plug } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { GithubIcon, GitlabIcon } from "@/components/icons/provider-icon"
import { useAppDispatch } from "@/store"
import { integrationsActions } from "@/store/slices/integrations.slice"
import { api } from "@/services/api"
import type { Integration, ProviderType } from "@/types/api"

interface Props {
  type: ProviderType
  integration: Integration | undefined
}

export function GitProviderCard({ type, integration }: Props) {
  const dispatch = useAppDispatch()
  const [verifying, setVerifying] = useState(false)
  const connected = !!integration && integration.status === "active"
  const label = type === "github" ? "GitHub" : "GitLab"

  const handleConnect = async () => {
    try {
      const { data } = await api.get<{ url: string; state: string }>(
        `/integrations/oauth/${type}/url`,
      )
      localStorage.setItem(`oauth_state_${type}`, data.state)
      window.location.href = data.url
    } catch {
      // handled by interceptor
    }
  }

  const handleDisconnect = () => {
    dispatch(integrationsActions.disconnectRequest(type))
  }

  const handleVerify = async () => {
    setVerifying(true)
    try {
      await api.post(`/integrations/${type}/verify`)
      toast.success(`${label} connection is healthy`)
    } catch {
      toast.error(`${label} connection test failed`)
      dispatch(integrationsActions.fetchIntegrationsRequest())
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900">
            {type === "github" ? (
              <GithubIcon className="h-5 w-5 text-white" />
            ) : (
              <GitlabIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{label}</h3>
            {connected && integration.metadata.username && (
              <p className="text-xs text-neutral-500">@{integration.metadata.username}</p>
            )}
          </div>
        </div>
        {connected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </div>

      <div className="mt-4">
        {connected ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              onClick={() => void handleVerify()}
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plug className="mr-1.5 h-3.5 w-3.5" />
              )}
              {verifying ? "Testing..." : "Test Connection"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
            {integration.metadata.serverUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-500 hover:text-white"
                onClick={() => window.open(integration.metadata.serverUrl!, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <Button
            size="sm"
            className="bg-white text-black hover:bg-neutral-200"
            onClick={() => void handleConnect()}
          >
            Connect {label}
          </Button>
        )}
      </div>
    </div>
  )
}
