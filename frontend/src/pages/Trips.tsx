import { useState } from "react"
import { Link } from "react-router-dom"
import { CreateTripModal } from "@/features/trips/components/CreateTripForm"
import { Button } from "@/components/ui/button"
import { useTrips } from "@/features/trips/useTrips"
import { Loader2, MapPin, Calendar, Plus } from "lucide-react"

export function TripsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { trips, loading, error } = useTrips()

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Trips</h1>
          <p className="text-[#9A9C9B]">
            {loading ? "Loading trips..." : `${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          variant="outline"
          size="icon"
          className="border-white/10 bg-black/20 text-white hover:bg-white/5 hover:text-[#3C4741] hover:scale-110 transition"
          aria-label="Create trip"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#3C4741]" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <p className="text-sm">Failed to load trips: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && trips.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="h-12 w-12 text-[#9A9C9B] mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No trips yet</h3>
          <p className="text-[#9A9C9B] mb-4">Create your first trip to get started</p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-app-accent text-white hover:bg-app-accent-hover"
          >
            Create your first trip
          </Button>
        </div>
      )}

      {/* Trips Grid */}
      {!loading && !error && trips.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              to={`/trips/${trip.id}`}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#1A1A1A] transition-all hover:border-[#3C4741] hover:shadow-lg"
            >
              {/* Cover Image */}
              {trip.coverPhotoUrl ? (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={trip.coverPhotoUrl}
                    alt={trip.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-[#3C4741]/20 to-[#1A1A1A] flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-[#3C4741]/40" />
                </div>
              )}

              {/* Trip Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                  {trip.name}
                </h3>
                {trip.description && (
                  <p className="text-sm text-[#9A9C9B] mb-3 line-clamp-2">
                    {trip.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-[#9A9C9B]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateTripModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  )
}
