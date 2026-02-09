import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { TripsPage } from "@/pages/Trips"
import { TripDetailPage } from "@/pages/TripDetail"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
