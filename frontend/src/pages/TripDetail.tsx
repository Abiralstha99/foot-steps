import { useState } from "react"
import { useParams } from "react-router-dom"
import { useTrips } from "@/features/trips/useTrips"
import TripHeader from "@/features/trips/components/TripHeader"
import { ViewModeSwitcher } from "@/features/trips/components/ViewModeSwitcher"
import type { ViewMode } from "@/features/trips/components/ViewModeSwitcher"

export function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const { trips, loading, error } = useTrips()
  const [activeMode, setActiveMode] = useState<ViewMode>("timeline")

  const trip = trips.find((t) => t.id === tripId)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-semibold text-white">Trip not found</h1>
          <p className="mt-2 text-sm text-[#9A9C9B]">
            {error ? `Error: ${error}` : "We couldn't find that trip."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TripHeader
        trip={{
          title: trip.name,
          location: trip.description || "Location not specified",
          startDate: trip.startDate,
          endDate: trip.endDate,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <ViewModeSwitcher
          activeMode={activeMode}
          onModeChange={setActiveMode}
        />

        {activeMode === "timeline" && (
          <div className="p-8 text-[#9A9C9B] text-center">
            <p className="text-lg">Timeline View (Coming Soon)</p>
          </div>
        )}

        {activeMode === "map" && (
          <div className="p-8 text-[#9A9C9B] text-center">
            <p className="text-lg">Map View (Coming Soon)</p>
          </div>
        )}

        {activeMode === "grid" && (
          <div className="p-8 text-[#9A9C9B] text-center">
            <p className="text-lg">Grid View (Coming Soon)</p>
          </div>
        )}
      </div>
    </div>
  )
}
