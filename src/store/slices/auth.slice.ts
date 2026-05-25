import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthState {
  user: AuthUser | null
  initialLoading: boolean
  submitting: boolean
  isAuthenticated: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  initialLoading: true,
  submitting: false,
  isAuthenticated: false,
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.submitting = true
      state.error = null
    },
    signupRequest(state, _action: PayloadAction<{ email: string; password: string; name: string }>) {
      state.submitting = true
      state.error = null
    },
    fetchMeRequest() {},
    authSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.initialLoading = false
      state.submitting = false
      state.error = null
    },
    authFailure(state, action: PayloadAction<string>) {
      state.user = null
      state.isAuthenticated = false
      state.initialLoading = false
      state.submitting = false
      state.error = action.payload
    },
    authLoaded(state) {
      state.initialLoading = false
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
  },
})

export const authActions = authSlice.actions
