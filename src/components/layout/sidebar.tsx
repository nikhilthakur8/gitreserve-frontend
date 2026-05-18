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
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`sticky top-0 flex h-screen flex-col border-r border-neutral-800 bg-neutral-950 shrink-0 transition-all duration-200 ease-in-out overflow-hidden ${
        expanded ? "w-60" : "w-12"
      }`}
    >
      {/* Header */}
      <div className={`flex h-14 items-center shrink-0 border-b border-neutral-800 ${expanded ? "justify-between px-4" : "justify-center"}`}>
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <Logo className={`shrink-0 transition-all duration-200 ${expanded ? "h-6 w-6" : "h-5 w-5"}`} />
          {expanded && (
            <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap animate-in fade-in duration-150">
              GitReserve
            </span>
          )}
        </Link>
        {expanded && (
          <button
            onClick={() => { setPinned(!pinned); if (pinned) setHovered(false) }}
            title={pinned ? "Unpin sidebar" : "Pin sidebar"}
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:text-white transition-colors shrink-0"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-1 ${expanded ? "px-2" : "px-1.5"}`}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              title={expanded ? undefined : item.label}
              className={`flex items-center gap-3 rounded-lg transition-colors ${
                expanded ? "px-3 py-2.5 text-sm" : "justify-center h-9 w-9"
              } ${
                active
                  ? "bg-neutral-800 text-white font-medium"
                  : "text-neutral-500 hover:bg-neutral-800/50 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {expanded && (
                <span className="whitespace-nowrap animate-in fade-in duration-150">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-neutral-800 ${expanded ? "p-3" : "py-3 flex flex-col items-center gap-2"}`}>
        {expanded ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-150">
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
        ) : (
          <>
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
          </>
        )}
      </div>
    </aside>
  )
}
