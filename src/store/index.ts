import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { useDispatch, useSelector } from "react-redux"
import { authSlice } from "./slices/auth.slice"
import { reposSlice } from "./slices/repos.slice"
import { integrationsSlice } from "./slices/integrations.slice"
import { activitySlice } from "./slices/activity.slice"
import { availableReposSlice } from "./slices/available-repos.slice"
import { rootSaga } from "./sagas"

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    repos: reposSlice.reducer,
    integrations: integrationsSlice.reducer,
    activity: activitySlice.reducer,
    availableRepos: availableReposSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
