import { Loader2, MessageSquare } from "lucide-react"

import type { Photo } from "@/app/types"
import { EmptyState } from "@/components/ui/EmptyState"
import { AiTagBadge } from "@/features/photos/components/AiTagBadge"
import { usePhotosByGrouped } from "@/features/trips/useTrips"
import { groupPhotosByDay } from "@/features/trips/utils/groupPhotosByDay"
import { DayHeader } from "./DayHeader"

type TripTimelineProps = {
  /** When set, fetches grouped photos from GET /trips/:id/photos/grouped (TripDetail). */
  tripId?: string
  /** When set and tripId is not used, groups these photos client-side (e.g. ShareAlbumPage). */
  photos?: Photo[]
  onPhotoClick?: (photo: Photo) => void
}

function NoPhotosIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="22" cy="28" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 42l12-10 8 8 8-6 12 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function TripTimeline({ tripId, photos, onPhotoClick }: TripTimelineProps) {
  const { groups: apiGroups, loading, error } = usePhotosByGrouped(tripId)
  const groupsFromPhotos = photos?.length ? groupPhotosByDay(photos) : []
  const groups = tripId ? apiGroups : groupsFromPhotos

  if (!tripId && !photos?.length) {
    return null
  }

  if (tripId && loading && groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="size-8 animate-spin text-accent" />
        <p className="text-sm text-text-muted">Loading timeline…</p>
      </div>
    )
  }

  if (tripId && error) {
    return (
      <EmptyState
        illustration={<NoPhotosIllustration />}
        headline="Couldn't load timeline"
        subline={error}
      />
    )
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        illustration={<NoPhotosIllustration />}
        headline="No photos yet"
        subline="Upload photos to start building your trip memories."
      />
    )
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.label}>
          <DayHeader label={group.label} />
          <div className="grid grid-cols-3 gap-1">
            {group.photos.map((photo) => {
              const src = photo.viewUrl ?? photo.url ?? ""
              const tags = (photo.aiTags ?? []).slice(0, 3)

              return (
                <div
                  key={photo.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPhotoClick?.(photo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onPhotoClick?.(photo)
                  }}
                  className="group relative aspect-square cursor-pointer overflow-hidden"
                >
                  <img
                    src={src}
                    alt={photo.caption || "Trip photo"}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  {/* Bottom overlay — AI tags + caption indicator */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex items-end justify-between gap-1">
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <AiTagBadge key={tag} tag={tag} />
                        ))}
                      </div>
                      {photo.caption && (
                        <MessageSquare className="size-4 shrink-0 text-white/80" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
