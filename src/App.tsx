// src/App.tsx
import SiteFooter from "@/components/layout/SiteFooter"
import SiteHeader from "@/components/layout/SiteHeader"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"

import { getProfile } from "@/features/auth/authSlice"
import AdminPanel from "@/pages/AdminPanel"
import Dashboard from "@/pages/Dashboard"
import HomePage from "@/pages/HomePage"
import UpgradePage from "@/pages/UpgradePage"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import AuthPage from "./pages/AuthPage"
import GoogleCallbackPage from "./pages/GoogleCallbackPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ProtectedRoute from "./routes/ProtectedRoute"
import RoleRoute from "./routes/RoleRoute"
import PlansPage from "./pages/PlansPage"

export default function App() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  // do a "check if user is still logged in" once
  useEffect(() => {
    // only call getProfile if user is null => so we don’t spam the endpoint 
    // or if you always want to check, that’s also fine
    if (!auth.user) {
      dispatch(getProfile())
    }
  }, [auth.user, dispatch])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/plans" element={<PlansPage />} />


          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleRoute requiredRole="admin">
                <AdminPanel />
              </RoleRoute>
            }
          />
          <Route path="*" element={<div className="p-4">404 Not Found</div>} />
        </Routes>
      </div>
      <SiteFooter />
    </div>
  )
}
