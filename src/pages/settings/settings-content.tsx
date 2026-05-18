import { useAppSelector } from "@/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function SettingsContent() {
  const { user } = useAppSelector((s) => s.auth)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account</p>
      </div>

      <div className="max-w-lg space-y-8">
        <section className="rounded-lg border border-neutral-800 bg-neutral-950 p-6">
          <h2 className="text-sm font-medium text-white mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400">Name</Label>
              <Input
                defaultValue={user?.name ?? ""}
                className="border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400">Email</Label>
              <Input
                defaultValue={user?.email ?? ""}
                className="border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-600"
                disabled
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-red-900/50 bg-neutral-950 p-6">
          <h2 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-neutral-500 mb-4">
            Permanently delete your account and all associated data.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300"
          >
            Delete account
          </Button>
        </section>
      </div>
    </div>
  )
}
