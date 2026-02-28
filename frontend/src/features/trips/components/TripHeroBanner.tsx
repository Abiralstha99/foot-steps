import { Calendar, Camera, MapPin, Pencil, Share2 } from "lucide-react"
import type { Trip } from "@/app/types"

type TripHeroBannerProps = {
    trip: Trip
    photoCount?: number
    onEdit?: () => void
    onShare?: () => void
    onChangeCover?: () => void
}

function formatDateRange(startDate: string, endDate: string): string {
    const fmt = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return ""
    return `${fmt.format(start)} – ${fmt.format(end)}`
}

export function TripHeroBanner({
    trip,
    photoCount,
    onEdit,
    onShare,
    onChangeCover,
}: TripHeroBannerProps) {
    const cover = trip.coverViewUrl ?? trip.coverPhotoUrl
    const count = photoCount ?? trip._count?.photos

    return (
        <div className="relative w-full h-[45vh] overflow-hidden">
            {/* Background */}
            {cover ? (
                <img
                    src={cover}
                    alt={trip.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-bg-raised to-bg-surface flex items-center justify-center">
                    <h1 className="font-display text-title text-text-muted drop-shadow-sm line-clamp-2 px-8 text-center">
                        {trip.name}
                    </h1>
                </div>
            )}

            {/* Gradient overlay (only when cover exists) */}
            {cover && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            )}

            {/* Top-right actions */}
            <div className="absolute top-4 right-4 flex gap-1.5">
                {onChangeCover && (
                    <button
                        type="button"
                        onClick={onChangeCover}
                        className="flex size-9 items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Change cover photo"
                    >
                        <Camera className="size-4" />
                    </button>
                )}
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="flex size-9 items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Edit trip"
                    >
                        <Pencil className="size-4" />
                    </button>
                )}
                {onShare && (
                    <button
                        type="button"
                        onClick={onShare}
                        className="flex size-9 items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Share trip"
                    >
                        <Share2 className="size-4" />
                    </button>
                )}
            </div>

            {/* Bottom-left text (only when cover exists for readability) */}
            {cover && (
                <div className="absolute bottom-6 left-6">
                    <h1 className="font-display text-title text-white drop-shadow-sm line-clamp-2">
                        {trip.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-body text-white/80">
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
                    </div>
                    {count != null && (
                        <p className="mt-1 text-small text-white/70">
                            {count} photo{count !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
