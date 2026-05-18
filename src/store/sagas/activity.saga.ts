import { call, put, takeLatest } from "redux-saga/effects"
import { toast } from "sonner"
import { api } from "@/services/api"
import { activityActions } from "@/store/slices/activity.slice"
import type { SyncJob } from "@/types/api"
import type { PayloadAction } from "@reduxjs/toolkit"

function* fetchJobsSaga(action: PayloadAction<string | undefined>) {
  try {
    const params = action.payload ? `?trackedRepoId=${action.payload}` : ""
    const { data }: { data: SyncJob[] } = yield call([api, "get"], `/sync/jobs${params}`)
    yield put(activityActions.fetchJobsSuccess(data))
  } catch (err: unknown) {
    const message = extractError(err)
    yield put(activityActions.fetchJobsFailure(message))
    toast.error(message)
  }
}

function extractError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response
    if (res?.data?.error) return res.data.error
  }
  return "Something went wrong"
}

export function* activitySaga() {
  yield takeLatest(activityActions.fetchJobsRequest.type, fetchJobsSaga)
}
