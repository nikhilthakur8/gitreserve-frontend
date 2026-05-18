import { Link, useLocation, useNavigate } from "react-router-dom"
import { BookMarked, Plug, Activity, Settings, LogOut, PanelLeft } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/store"
import { authActions } from "@/store/slices/auth.slice"
import { Logo } from "@/components/icons/logo"

const NAV_ITEMS = [
  { label: "Repositories", icon: BookMarked, path: "/dashboard" },
  { label: "Integrations", icon: Plug, path: "/integrations" },
  { label: "Activity", icon: Activity, path: "/activity" },
  { label: "Settings", icon: Settings, path: "/settings" },
]

export function Sidebar() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)

  const expanded = pinned || hovered

  const handleLogout = () => {
    dispatch(authActions.logout())
    toast.success("Logged out")
    navigate("/login")
  }

  return (
    <>
      {/* Collapsed strip — always visible when sidebar is closed */}
      {!pinned && (
        <div className="sticky top-0 flex h-screen w-12 flex-col items-center border-r border-neutral-800 bg-neutral-950 py-4 shrink-0">
          <Link to="/" className="mb-6">
            <Logo className="h-5 w-5" />
          </Link>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`mb-1 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-500 hover:bg-neutral-800/50 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
              </Link>
            )
          })}
          <div className="mt-auto flex flex-col items-center gap-2">
            <button
              onClick={() => setPinned(true)}
              title="Expand sidebar"
              className="flex h-8 w-8 items-center justify-center rounded text-neutral-500 hover:text-white transition-colors"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-medium text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Expanded sidebar — only when pinned */}
      {pinned && (
        <aside
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="sticky top-0 flex h-screen w-60 flex-col border-r border-neutral-800 bg-neutral-950 shrink-0"
        >
          <div className="flex h-14 items-center justify-between px-4 border-b border-neutral-800">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-6 w-6 shrink-0" />
              <span className="text-sm font-semibold tracking-tight text-white">GitReserve</span>
            </Link>
            <button
              onClick={() => setPinned(false)}
              title="Collapse sidebar"
              className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:text-white transition-colors"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-neutral-800 text-white font-medium"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-neutral-800 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-medium text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-neutral-500 hover:text-white transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
