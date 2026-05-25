import { useEffect, useRef, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/store"
import { authActions } from "@/store/slices/auth.slice"

export function LoginPage() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, error, submitting } = useAppSelector((s) => s.auth)
  const navigate = useNavigate()
  const lastError = useRef(error)

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back!")
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error && error !== lastError.current) {
      toast.error(error)
    }
    lastError.current = error
  }, [error])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    dispatch(authActions.loginRequest({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-sm border-neutral-800 bg-neutral-950">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-neutral-400">Sign in to your GitReserve account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-neutral-600"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
