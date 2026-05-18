import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SyncJob } from "@/types/api"

interface ActivityState {
  jobs: SyncJob[]
  loading: boolean
  error: string | null
}

const initialState: ActivityState = {
  jobs: [],
  loading: false,
  error: null,
}

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    fetchJobsRequest(state, _action: PayloadAction<string | undefined>) {
      state.loading = true
      state.error = null
    },
    fetchJobsSuccess(state, action: PayloadAction<SyncJob[]>) {
      state.jobs = action.payload
      state.loading = false
    },
    fetchJobsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const activityActions = activitySlice.actions
