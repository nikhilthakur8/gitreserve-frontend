import { useState, useEffect, useCallback } from "react"
import { authService, type User } from "@/services/auth.service"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const userData = await authService.me()
      setUser(userData)
      setIsAuthenticated(true)
    } catch {
      localStorage.removeItem("token")
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password })
    localStorage.setItem("token", res.accessToken)
    await fetchUser()
  }

  const signup = async (email: string, password: string, name: string) => {
    const res = await authService.signup({ email, password, name })
    localStorage.setItem("token", res.accessToken)
    await fetchUser()
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  return { user, loading, isAuthenticated, login, signup, logout }
}
