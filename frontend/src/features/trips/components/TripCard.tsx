import { Link } from "react-router-dom"
import { Calendar, Images, MapPin } from "lucide-react"

import type { Trip } from "@/app/types"

function formatDateRange(startDate: string, endDate: string): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${fmt.format(new Date(startDate))} – ${fmt.format(new Date(endDate))}`
}

export function TripCard({ trip }: { trip: Trip }) {
  const cover = trip.coverViewUrl ?? trip.coverPhotoUrl

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block rounded-lg overflow-hidden bg-bg-surface border border-border-token hover:border-amber-500/40 hover:shadow-[0_0_0_1px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bg-raised to-bg-surface flex items-center justify-center">
            <MapPin className="size-10 text-text-muted" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <h3 className="text-subheading font-semibold text-text-primary line-clamp-1">
          {trip.name}
        </h3>

        {trip.location && (
          <div className="flex items-center gap-1.5 text-small text-text-secondary">
            <MapPin className="size-3.5 shrink-0" />
            <span className="line-clamp-1">{trip.location}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-small text-text-secondary">
          <Calendar className="size-3.5 shrink-0" />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>

        {trip._count != null && (
          <div className="flex items-center gap-1.5 text-small text-text-secondary">
            <Images className="size-3.5 shrink-0" />
            <span>
              {trip._count.photos} photo{trip._count.photos !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
