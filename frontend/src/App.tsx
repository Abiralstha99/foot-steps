import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useAuthToken } from "@/features/auth/useAuthToken"
import { AppLayout } from "@/components/layout/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { LandingPage } from "@/pages/LandingPage"
import { TripsPage } from "@/pages/Trips"
import { TripDetailPage } from "@/pages/TripDetail"
import ExplorePage from "@/pages/ExplorePage"

function App() {
  const { isSignedIn, isLoaded } = useAuth()
  useAuthToken()

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={isSignedIn ? <Navigate to="/home" replace /> : <LandingPage />} />

      {/* Protected routes with sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={isSignedIn ? <HomePage /> : <Navigate to="/" replace />} />
        <Route path="/trips" element={isSignedIn ? <TripsPage /> : <Navigate to="/" replace />} />
        <Route path="/trips/:id" element={isSignedIn ? <TripDetailPage /> : <Navigate to="/" replace />} />
        <Route path="/explore" element={isSignedIn ? <ExplorePage /> : <Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
