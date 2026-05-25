import { call, put, takeLatest } from "redux-saga/effects"
import { toast } from "sonner"
import { api } from "@/services/api"
import { reposActions } from "@/store/slices/repos.slice"
import type { TrackedRepo, TrackRepoPayload, UpdateRepoPayload } from "@/types/api"
import type { PayloadAction } from "@reduxjs/toolkit"

function* fetchReposSaga() {
  try {
    const { data }: { data: TrackedRepo[] } = yield call([api, "get"], "/repositories")
    yield put(reposActions.fetchReposSuccess(data))
  } catch (err: unknown) {
    const message = extractError(err)
    yield put(reposActions.fetchReposFailure(message))
    toast.error(message)
  }
}

function* trackRepoSaga(action: PayloadAction<TrackRepoPayload>) {
  try {
    const { data }: { data: TrackedRepo } = yield call(
      [api, "post"],
      "/repositories/track",
      action.payload,
    )
    yield put(reposActions.trackRepoSuccess(data))
    toast.success("Repository tracked")
  } catch (err: unknown) {
    yield put(reposActions.trackRepoFailure())
    toast.error(extractError(err))
  }
}

function* untrackRepoSaga(action: PayloadAction<string>) {
  try {
    yield call([api, "delete"], `/repositories/${action.payload}`)
    yield put(reposActions.untrackRepoSuccess(action.payload))
    toast.success("Repository removed")
  } catch (err: unknown) {
    yield put(reposActions.untrackRepoFailure(action.payload))
    toast.error(extractError(err))
  }
}

function* updateRepoSaga(action: PayloadAction<UpdateRepoPayload>) {
  const { repoId, ...body } = action.payload
  try {
    const { data }: { data: TrackedRepo } = yield call(
      [api, "patch"],
      `/repositories/${repoId}`,
      body,
    )
    yield put(reposActions.updateRepoSuccess(data))
    toast.success("Repository updated")
  } catch (err: unknown) {
    toast.error(extractError(err))
  }
}

function* syncRepoSaga(action: PayloadAction<string>) {
  try {
    const { data }: { data: TrackedRepo } = yield call(
      [api, "post"],
      `/repositories/${action.payload}/sync`,
    )
    yield put(reposActions.syncRepoSuccess({ repoId: action.payload, repo: data }))
    toast.success("Sync triggered")
  } catch (err: unknown) {
    yield put(reposActions.syncRepoFailure(action.payload))
    toast.error(extractError(err))
  }
}

function extractError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response
    if (res?.data?.error) return res.data.error
  }
  return "Something went wrong"
}

export function* reposSaga() {
  yield takeLatest(reposActions.fetchReposRequest.type, fetchReposSaga)
  yield takeLatest(reposActions.trackRepoRequest.type, trackRepoSaga)
  yield takeLatest(reposActions.untrackRepoRequest.type, untrackRepoSaga)
  yield takeLatest(reposActions.updateRepoRequest.type, updateRepoSaga)
  yield takeLatest(reposActions.syncRepoRequest.type, syncRepoSaga)
}
