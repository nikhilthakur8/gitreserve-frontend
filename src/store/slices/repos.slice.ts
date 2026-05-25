import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { TrackedRepo, TrackRepoPayload, UpdateRepoPayload } from "@/types/api"

interface ReposState {
  items: TrackedRepo[]
  loading: boolean
  tracking: boolean
  error: string | null
  syncing: Record<string, boolean>
  deleting: Record<string, boolean>
}

const initialState: ReposState = {
  items: [],
  loading: false,
  tracking: false,
  error: null,
  syncing: {},
  deleting: {},
}

export const reposSlice = createSlice({
  name: "repos",
  initialState,
  reducers: {
    fetchReposRequest(state) {
      state.loading = true
      state.error = null
    },
    fetchReposSuccess(state, action: PayloadAction<TrackedRepo[]>) {
      state.items = action.payload
      state.loading = false
    },
    fetchReposFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    trackRepoRequest(state, _action: PayloadAction<TrackRepoPayload>) {
      state.tracking = true
    },
    trackRepoSuccess(state, action: PayloadAction<TrackedRepo>) {
      state.tracking = false
      state.items.push(action.payload)
    },
    trackRepoFailure(state) {
      state.tracking = false
    },
    untrackRepoRequest(state, action: PayloadAction<string>) {
      state.deleting[action.payload] = true
    },
    untrackRepoSuccess(state, action: PayloadAction<string>) {
      delete state.deleting[action.payload]
      state.items = state.items.filter((r) => r.id !== action.payload)
    },
    untrackRepoFailure(state, action: PayloadAction<string>) {
      delete state.deleting[action.payload]
    },
    updateRepoRequest(_, _action: PayloadAction<UpdateRepoPayload>) {},
    updateRepoSuccess(state, action: PayloadAction<TrackedRepo>) {
      state.items = state.items.map((r) => (r.id === action.payload.id ? action.payload : r))
    },
    syncRepoRequest(state, action: PayloadAction<string>) {
      state.syncing[action.payload] = true
    },
    syncRepoSuccess(state, action: PayloadAction<{ repoId: string; repo: TrackedRepo }>) {
      state.syncing[action.payload.repoId] = false
      state.items = state.items.map((r) => (r.id === action.payload.repoId ? action.payload.repo : r))
    },
    syncRepoFailure(state, action: PayloadAction<string>) {
      state.syncing[action.payload] = false
    },
  },
})

export const reposActions = reposSlice.actions
