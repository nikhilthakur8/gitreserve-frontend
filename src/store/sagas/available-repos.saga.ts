import { call, put, takeLatest } from "redux-saga/effects"
import { toast } from "sonner"
import { api } from "@/services/api"
import { availableReposActions } from "@/store/slices/available-repos.slice"
import type { AvailableRepo, ProviderType } from "@/types/api"
import type { PayloadAction } from "@reduxjs/toolkit"

function* fetchAvailableSaga(action: PayloadAction<ProviderType>) {
  try {
    const { data }: { data: AvailableRepo[] } = yield call(
      [api, "get"],
      `/repositories/available/${action.payload}`,
    )
    yield put(availableReposActions.fetchAvailableSuccess(data))
  } catch (err: unknown) {
    const message = extractError(err)
    yield put(availableReposActions.fetchAvailableFailure(message))
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

export function* availableReposSaga() {
  yield takeLatest(availableReposActions.fetchAvailableRequest.type, fetchAvailableSaga)
}
