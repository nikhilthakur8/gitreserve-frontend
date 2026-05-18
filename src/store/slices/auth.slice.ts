import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: string
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(_, _action: PayloadAction<{ email: string; password: string }>) {},
    signupRequest(_, _action: PayloadAction<{ email: string; password: string; name: string }>) {},
    fetchMeRequest() {},
    authSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    authFailure(state, action: PayloadAction<string>) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = action.payload
    },
    authLoaded(state) {
      state.loading = false
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
  },
})

export const authActions = authSlice.actions
