import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialLoading } = useAuth()

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
