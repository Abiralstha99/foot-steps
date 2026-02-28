import { useState } from "react"
import { Link } from "react-router-dom"
import { Calendar, Images, Loader2, MapPin, Plus } from "lucide-react"

import { CreateTripModal } from "@/features/trips/components/CreateTripForm"
import { TripCard } from "@/features/trips/components/TripCard"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/EmptyState"
import { SuitcaseIllustration } from "@/components/illustrations/SuitcaseIllustration"
import { useTrips } from "@/features/trips/useTrips"
import type { Trip } from "@/app/types"

function formatDateRange(startDate: string, endDate: string): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${fmt.format(new Date(startDate))} – ${fmt.format(new Date(endDate))}`
}

function HeroCard({ trip }: { trip: Trip }) {
  const cover = trip.coverViewUrl ?? trip.coverPhotoUrl

  return (
    <div className="relative h-[40vh] max-h-[400px] w-full overflow-hidden rounded-lg">
      {/* Blurred background */}
      {cover ? (
        <img
          src={cover}
          alt={trip.name}
          className="absolute inset-0 h-full w-full object-cover blur-sm brightness-75"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-raised to-bg-surface" />
      )}

      {/* Frosted glass card */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md dark:bg-black/20">
          <h2 className="font-display text-title text-white drop-shadow-sm line-clamp-2">
            {trip.name}
          </h2>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-body text-white/80">
            {trip.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 shrink-0" />
                {trip.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 shrink-0" />
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
            {trip._count != null && (
              <span className="flex items-center gap-1.5">
                <Images className="size-4 shrink-0" />
                {trip._count.photos} photos
              </span>
            )}
          </div>

          <div className="mt-6">
            <Button asChild variant="primary">
              <Link to={`/trips/${trip.id}`}>View Trip →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TripsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { trips, loading, error } = useTrips()

  const sortedTrips = [...trips].sort(
    (a, b) =>
      new Date(b.createdAt ?? b.startDate).getTime() -
      new Date(a.createdAt ?? a.startDate).getTime()
  )
  const heroTrip = sortedTrips[0] ?? null
  const gridTrips = sortedTrips.slice(1)

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-heading text-text-primary">My Trips</h1>
        <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
          <Plus className="size-4" />
          New Trip
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-accent" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          Failed to load trips: {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && trips.length === 0 && (
        <EmptyState
          illustration={<SuitcaseIllustration />}
          headline="Your adventures start here"
          subline="Create your first trip to start collecting memories."
          action={
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              <Plus className="size-4" />
              Create your first trip
            </Button>
          }
        />
      )}

      {/* Hero + grid */}
      {!loading && !error && heroTrip && (
        <>
          <HeroCard trip={heroTrip} />

          {gridTrips.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </>
      )}

      <CreateTripModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  )
}
