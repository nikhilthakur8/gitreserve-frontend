import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AvailableRepo, ProviderType } from "@/types/api"

interface AvailableReposState {
  items: AvailableRepo[]
  loading: boolean
  error: string | null
}

const initialState: AvailableReposState = {
  items: [],
  loading: false,
  error: null,
}

export const availableReposSlice = createSlice({
  name: "availableRepos",
  initialState,
  reducers: {
    fetchAvailableRequest(state, _action: PayloadAction<ProviderType>) {
      state.loading = true
      state.error = null
      state.items = []
    },
    fetchAvailableSuccess(state, action: PayloadAction<AvailableRepo[]>) {
      state.items = action.payload
      state.loading = false
    },
    fetchAvailableFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    clear(state) {
      state.items = []
      state.error = null
    },
  },
})

export const availableReposActions = availableReposSlice.actions
