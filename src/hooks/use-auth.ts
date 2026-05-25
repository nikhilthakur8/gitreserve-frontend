import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store"
import { authActions } from "@/store/slices/auth.slice"

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, initialLoading, submitting, isAuthenticated, error } = useAppSelector((s) => s.auth)

  useEffect(() => {
    dispatch(authActions.fetchMeRequest())
  }, [dispatch])

  const login = (email: string, password: string) => {
    dispatch(authActions.loginRequest({ email, password }))
  }

  const signup = (email: string, password: string, name: string) => {
    dispatch(authActions.signupRequest({ email, password, name }))
  }

  const logout = () => {
    dispatch(authActions.logout())
  }

  return { user, initialLoading, submitting, isAuthenticated, error, login, signup, logout }
}
