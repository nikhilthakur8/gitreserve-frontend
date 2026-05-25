import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { Toaster } from "@/components/ui/sonner"
import { store } from "@/store"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/auth/login"
import { SignupPage } from "@/pages/auth/signup"
import { DashboardPage } from "@/pages/dashboard"
import { IntegrationsPage } from "@/pages/integrations"
import { ActivityPage } from "@/pages/activity"
import { SettingsPage } from "@/pages/settings"
import { AddRepoPage } from "@/pages/repos/add-repo"
import { RepoDetailPage } from "@/pages/repos/repo-detail"
import { OAuthCallbackPage } from "@/pages/integrations/oauth-callback"
import { AuthOAuthCallbackPage } from "@/pages/auth/oauth-callback"
import { DocsPage } from "@/pages/docs"
import { ProtectedRoute } from "@/layouts/protected-route"

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/oauth/callback" element={<AuthOAuthCallbackPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/integrations"
            element={
              <ProtectedRoute>
                <IntegrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repos/add"
            element={
              <ProtectedRoute>
                <AddRepoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repos/:repoId"
            element={
              <ProtectedRoute>
                <RepoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/github/callback"
            element={
              <ProtectedRoute>
                <OAuthCallbackPage type="github" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/gitlab/callback"
            element={
              <ProtectedRoute>
                <OAuthCallbackPage type="gitlab" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Provider>
  )
}
