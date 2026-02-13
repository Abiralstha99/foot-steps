import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { LandingPage } from "@/pages/LandingPage"
import { TripsPage } from "@/pages/Trips"
import { TripDetailPage } from "@/pages/TripDetail"
import ExplorePage from "@/pages/ExplorePage"

function App() {
  const isAuthenticated = true

  return (
    <Routes>
      {/* Landing page without sidebar */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
      />

      {/* App routes with sidebar */}
      <Route element={<AppLayout />}>
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/trips"
          element={isAuthenticated ? <TripsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/trips/:id"
          element={
            isAuthenticated ? <TripDetailPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/explore"
          element={
            isAuthenticated ? <ExplorePage /> : <Navigate to="/" replace />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
