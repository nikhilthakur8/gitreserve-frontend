import { all, fork } from "redux-saga/effects"
import { authSaga } from "./auth.saga"
import { reposSaga } from "./repos.saga"
import { integrationsSaga } from "./integrations.saga"
import { activitySaga } from "./activity.saga"
import { availableReposSaga } from "./available-repos.saga"

export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(reposSaga),
    fork(integrationsSaga),
    fork(activitySaga),
    fork(availableReposSaga),
  ])
}
