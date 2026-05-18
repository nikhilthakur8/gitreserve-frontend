import { call, put, takeLatest } from "redux-saga/effects"
import { api } from "@/services/api"
import { authActions, type AuthUser } from "@/store/slices/auth.slice"
import type { PayloadAction } from "@reduxjs/toolkit"

function* fetchMeSaga() {
  const token = localStorage.getItem("token")
  if (!token) {
    yield put(authActions.authLoaded())
    return
  }
  try {
    const { data }: { data: AuthUser } = yield call([api, "get"], "/auth/me")
    yield put(authActions.authSuccess(data))
  } catch {
    localStorage.removeItem("token")
    yield put(authActions.authLoaded())
  }
}

function* loginSaga(action: PayloadAction<{ email: string; password: string }>) {
  try {
    const { data }: { data: { accessToken: string } } = yield call(
      [api, "post"],
      "/auth/login",
      action.payload,
    )
    localStorage.setItem("token", data.accessToken)
    const { data: user }: { data: AuthUser } = yield call([api, "get"], "/auth/me")
    yield put(authActions.authSuccess(user))
  } catch (err: unknown) {
    const message = extractError(err)
    yield put(authActions.authFailure(message))
  }
}

function* signupSaga(action: PayloadAction<{ email: string; password: string; name: string }>) {
  try {
    const { data }: { data: { accessToken: string } } = yield call(
      [api, "post"],
      "/auth/signup",
      action.payload,
    )
    localStorage.setItem("token", data.accessToken)
    const { data: user }: { data: AuthUser } = yield call([api, "get"], "/auth/me")
    yield put(authActions.authSuccess(user))
  } catch (err: unknown) {
    const message = extractError(err)
    yield put(authActions.authFailure(message))
  }
}

function* logoutSaga() {
  localStorage.removeItem("token")
}

function extractError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { error?: string } } }).response
    if (res?.data?.error) return res.data.error
  }
  return "Something went wrong"
}

export function* authSaga() {
  yield takeLatest(authActions.fetchMeRequest.type, fetchMeSaga)
  yield takeLatest(authActions.loginRequest.type, loginSaga)
  yield takeLatest(authActions.signupRequest.type, signupSaga)
  yield takeLatest(authActions.logout.type, logoutSaga)
}
