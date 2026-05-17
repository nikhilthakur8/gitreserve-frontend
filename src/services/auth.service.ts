import { api } from "./api"

export interface SignupPayload {
  email: string
  password: string
  name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  expiresIn: number
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export const authService = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload)
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload)
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/auth/me")
    return data
  },
}
