import { call, put, takeLatest } from "redux-saga/effects"
import { toast } from "sonner"
import { api } from "@/services/api"
import { integrationsActions } from "@/store/slices/integrations.slice"
import type { Integration, IntegrationType } from "@/types/api"
import type { PayloadAction } from "@reduxjs/toolkit"

function* fetchIntegrationsSaga() {
  try {
    const { data }: { data: Integration[] } = yield call([api, "get"], "/integrations")
    yield put(integrationsActions.fetchIntegrationsSuccess(data))
  } catch (err: unknown) {
    const message = extractError(err)
    yield put(integrationsActions.fetchIntegrationsFailure(message))
    toast.error(message)
  }
}

function* connectSaga(action: PayloadAction<{ type: IntegrationType; code: string; state: string }>) {
  try {
    const { data }: { data: Integration } = yield call(
      [api, "post"],
      `/integrations/connect/${action.payload.type}`,
      { code: action.payload.code, state: action.payload.state },
    )
    yield put(integrationsActions.connectSuccess(data))
    toast.success(`${action.payload.type} connected`)
  } catch (err: unknown) {
    toast.error(extractError(err))
  }
}

function* disconnectSaga(action: PayloadAction<IntegrationType>) {
  try {
    yield call([api, "delete"], `/integrations/${action.payload}`)
    yield put(integrationsActions.disconnectSuccess(action.payload))
    toast.success(`${action.payload} disconnected`)
  } catch (err: unknown) {
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

export function* integrationsSaga() {
  yield takeLatest(integrationsActions.fetchIntegrationsRequest.type, fetchIntegrationsSaga)
  yield takeLatest(integrationsActions.connectRequest.type, connectSaga)
  yield takeLatest(integrationsActions.disconnectRequest.type, disconnectSaga)
}
