import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Integration, IntegrationType } from "@/types/api"

interface IntegrationsState {
  items: Integration[]
  loading: boolean
  error: string | null
}

const initialState: IntegrationsState = {
  items: [],
  loading: false,
  error: null,
}

export const integrationsSlice = createSlice({
  name: "integrations",
  initialState,
  reducers: {
    fetchIntegrationsRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchIntegrationsSuccess(state, action: PayloadAction<Integration[]>) {
      state.items = action.payload
      state.loading = false
    },
    fetchIntegrationsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    connectRequest(_, _action: PayloadAction<{ type: IntegrationType; code: string; state: string }>) {},
    connectSuccess(state, action: PayloadAction<Integration>) {
      state.items.push(action.payload)
    },
    disconnectRequest(_, _action: PayloadAction<IntegrationType>) {},
    disconnectSuccess(state, action: PayloadAction<IntegrationType>) {
      state.items = state.items.filter((i) => i.type !== action.payload)
    },
  },
})

export const integrationsActions = integrationsSlice.actions
