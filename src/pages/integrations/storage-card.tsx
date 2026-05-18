import { useState } from "react"
import { CheckCircle2, Server, ChevronsUpDown, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store"
import { integrationsActions } from "@/store/slices/integrations.slice"
import { api } from "@/services/api"
import type { Integration, ConnectStoragePayload } from "@/types/api"

const S3_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "af-south-1", label: "Africa (Cape Town)" },
  { value: "ap-east-1", label: "Asia Pacific (Hong Kong)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-south-2", label: "Asia Pacific (Hyderabad)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ap-southeast-3", label: "Asia Pacific (Jakarta)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-northeast-2", label: "Asia Pacific (Seoul)" },
  { value: "ap-northeast-3", label: "Asia Pacific (Osaka)" },
  { value: "ca-central-1", label: "Canada (Central)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "eu-central-2", label: "Europe (Zurich)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-west-3", label: "Europe (Paris)" },
  { value: "eu-south-1", label: "Europe (Milan)" },
  { value: "eu-south-2", label: "Europe (Spain)" },
  { value: "eu-north-1", label: "Europe (Stockholm)" },
  { value: "il-central-1", label: "Israel (Tel Aviv)" },
  { value: "me-south-1", label: "Middle East (Bahrain)" },
  { value: "me-central-1", label: "Middle East (UAE)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
]

const R2_REGIONS = [
  { value: "auto", label: "Auto (Recommended)" },
  { value: "wnam", label: "Western North America" },
  { value: "enam", label: "Eastern North America" },
  { value: "weur", label: "Western Europe" },
  { value: "eeur", label: "Eastern Europe" },
  { value: "apac", label: "Asia Pacific" },
]

interface Props {
  type: "s3" | "r2"
  integration: Integration | undefined
}

export function StorageCard({ type, integration }: Props) {
  const dispatch = useAppDispatch()
  const connected = !!integration && integration.status === "active"
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [testing, setTesting] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [form, setForm] = useState<ConnectStoragePayload>({
    endpoint: type === "s3" ? "https://s3.us-east-1.amazonaws.com" : "",
    region: type === "r2" ? "auto" : "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",
    bucket: "",
  })

  const regions = type === "s3" ? S3_REGIONS : R2_REGIONS
  const selectedRegion = regions.find((r) => r.value === form.region)

  const handleRegionChange = (region: string) => {
    const endpoint =
      type === "s3"
        ? `https://s3.${region}.amazonaws.com`
        : form.endpoint
    setForm({ ...form, region, endpoint })
  }

  const handleConnect = async () => {
    setSubmitting(true)
    try {
      const { data } = await api.post(`/integrations/connect/${type}`, form)
      dispatch(integrationsActions.connectSuccess(data))
      toast.success(`${type.toUpperCase()} connected`)
      setShowForm(false)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg || "Failed to connect")
    } finally {
      setSubmitting(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      await api.post(`/integrations/${type}/verify`)
      toast.success(`${type.toUpperCase()} connection is healthy`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg || "Connection test failed")
    } finally {
      setTesting(false)
    }
  }

  const handleDisconnect = () => {
    dispatch(integrationsActions.disconnectRequest(type))
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900">
            <Server className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              {type === "s3" ? "AWS S3" : "Cloudflare R2"}
            </h3>
            {connected && integration.metadata.serverUrl && (
              <p className="text-xs text-neutral-500 truncate max-w-[180px]">
                {integration.metadata.serverUrl}
              </p>
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
              onClick={() => void handleTest()}
              disabled={testing}
            >
              {testing ? "Testing..." : "Test connection"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : showForm ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400">Region</Label>
              <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={regionOpen}
                    className="h-8 w-full justify-between text-xs border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
                  >
                    <span className="truncate">
                      {selectedRegion?.label ?? "Select region"}
                    </span>
                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search region..." className="text-xs" />
                    <CommandList>
                      <CommandEmpty>No region found.</CommandEmpty>
                      <CommandGroup>
                        {regions.map((r) => (
                          <CommandItem
                            key={r.value}
                            value={`${r.value} ${r.label}`}
                            onSelect={() => {
                              handleRegionChange(r.value)
                              setRegionOpen(false)
                            }}
                            className="text-xs"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-3 w-3",
                                form.region === r.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <span className="truncate">{r.label}</span>
                            <span className="ml-auto text-[10px] text-neutral-500">{r.value}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400">Endpoint</Label>
              <Input
                placeholder={type === "s3" ? "https://s3.us-east-1.amazonaws.com" : "https://<account-id>.r2.cloudflarestorage.com"}
                value={form.endpoint}
                onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
                className="h-8 text-xs border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
              />
              {type === "s3" && (
                <p className="text-[10px] text-neutral-600">Auto-filled from region. Override if using a custom endpoint.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400">Bucket</Label>
              <Input
                placeholder="my-bucket"
                value={form.bucket}
                onChange={(e) => setForm({ ...form, bucket: e.target.value })}
                className="h-8 text-xs border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Access Key ID</Label>
                <Input
                  placeholder="AKIA..."
                  value={form.accessKeyId}
                  onChange={(e) => setForm({ ...form, accessKeyId: e.target.value })}
                  className="h-8 text-xs border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-400">Secret Access Key</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.secretAccessKey}
                  onChange={(e) => setForm({ ...form, secretAccessKey: e.target.value })}
                  className="h-8 text-xs border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-neutral-200"
                onClick={() => void handleConnect()}
                disabled={submitting}
              >
                {submitting ? "Testing..." : "Connect"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            className="bg-white text-black hover:bg-neutral-200"
            onClick={() => setShowForm(true)}
          >
            Connect {type === "s3" ? "S3" : "R2"}
          </Button>
        )}
      </div>
    </div>
  )
}
