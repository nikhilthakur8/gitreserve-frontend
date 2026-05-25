import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useAppDispatch } from "@/store"
import { authActions } from "@/store/slices/auth.slice"

export function AuthOAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = searchParams.get("token")
    sessionStorage.removeItem("oauth_state")

    if (token) {
      localStorage.setItem("token", token)
      dispatch(authActions.fetchMeRequest())
      toast.success("Signed in successfully!")
      navigate("/dashboard", { replace: true })
    } else {
      const error = searchParams.get("error")
      toast.error(error || "Authentication failed. Please try again.")
      navigate("/login", { replace: true })
    }
  }, [searchParams, navigate, dispatch])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex items-center gap-3 text-neutral-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
        Signing you in...
      </div>
    </div>
  )
}
