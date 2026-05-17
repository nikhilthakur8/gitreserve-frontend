import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">GitReserve</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          Your repositories and integrations will appear here.
        </p>
      </main>
    </div>
  )
}
