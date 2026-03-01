import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { TripHeroBanner } from "@/features/trips/components/TripHeroBanner"
import { TripTabBar, type TripTab } from "@/features/trips/components/TripTabBar"
import { TripMapView } from "@/features/trips/components/TripMapView"
import { TripTimeline } from "@/features/trips/components/TripTimeline"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { PhotoLightbox } from "@/features/photos/components/PhotoLightbox"
import { SharedAlbumFooter } from "@/components/SharedAlbumFooter"
import api from "@/lib/api"
import type { Photo, Trip } from "@/app/types"

type SharedTrip = Trip & { photos: Photo[] }

function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message
    if (typeof msg === "string") return msg
  }
  return fallback
}

export function ShareAlbumPage() {
  const { token } = useParams<{ token: string }>()
  const [activeTab, setActiveTab] = useState<TripTab>("grid")
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [trip, setTrip] = useState<SharedTrip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false

    const fetchAlbum = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get(`/share/${token}`)
        if (!cancelled) setTrip(res.data as SharedTrip)
      } catch (err: unknown) {
        if (!cancelled) setError(extractErrorMessage(err, "This album is no longer available."))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchAlbum()
    return () => {
      cancelled = true
    }
  }, [token])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-base">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-base px-6 text-center">
        <h1 className="font-display text-heading text-text-primary">Album not found</h1>
        <p className="text-body text-text-muted">{error ?? "This album is no longer available."}</p>
        <a href="/" className="text-small text-accent hover:underline">
          Go home
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero — full bleed, no edit/share/cover controls */}
      <TripHeroBanner trip={trip} photoCount={trip.photos?.length} />

      {/* Tab bar + content in a centered container */}
      <div className="mx-auto max-w-screen-xl">
        <TripTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6 px-6 pb-6">
          {activeTab === "grid" && (
            <PhotoGrid
              photos={trip.photos ?? []}
              isLoading={false}
              onPhotoClick={(_, index) => setLightboxIndex(index)}
              readOnly
            />
          )}
          {activeTab === "timeline" && (
            <TripTimeline
              photos={trip.photos ?? []}
              onPhotoClick={(photo) => {
                const idx = trip.photos?.findIndex((p) => p.id === photo.id) ?? -1
                setLightboxIndex(idx >= 0 ? idx : 0)
              }}
            />
          )}
          {activeTab === "map" && <TripMapView photos={trip.photos ?? []} />}
        </div>
      </div>

      {/* Lightbox — read-only: captions visible but no edit or delete */}
      <PhotoLightbox
        photos={trip.photos ?? []}
        initialIndex={lightboxIndex >= 0 ? lightboxIndex : 0}
        open={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        readOnly
      />

      <SharedAlbumFooter />
    </div>
  )
}
