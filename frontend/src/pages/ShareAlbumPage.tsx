import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { TripHeroBanner } from "@/features/trips/components/TripHeroBanner"
import {
  TripTabBar,
  type TripTab,
} from "@/features/trips/components/TripTabBar"
import { TripMapView } from "@/features/trips/components/TripMapView"
import { TripTimeline } from "@/features/trips/components/TripTimeline"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { PhotoLightbox } from "@/features/photos/components/PhotoLightbox"
import { SharedAlbumFooter } from "@/components/SharedAlbumFooter"
import api from "@/lib/api"
import type { Photo, Trip } from "@/app/types"

type SharedTrip = Trip & { photos: Photo[] }

const ALBUM_UNAVAILABLE = "This album is no longer available."

function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const responseMsg = (err as { response?: { data?: { message?: string } } })
      .response?.data?.message
    if (typeof responseMsg === "string") return responseMsg
    const message = (err as { message?: string }).message
    if (typeof message === "string") return message
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
    if (!token) {
      setIsLoading(false)
      setError(ALBUM_UNAVAILABLE)
      return
    }

    let cancelled = false

    const fetchAlbum = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get(`/trips/share/${token}`)
        if (!cancelled) {
          setTrip(res.data.trip as SharedTrip)
        }
      } catch (err) {
        if (!cancelled) {
          setError(extractErrorMessage(err, ALBUM_UNAVAILABLE))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void fetchAlbum()
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
        <h1 className="font-display text-heading text-text-primary">
          Album not found
        </h1>
        <p className="text-body text-text-muted">
          {error ?? ALBUM_UNAVAILABLE}
        </p>
        <Link to="/" className="text-small text-accent hover:underline">
          Go home
        </Link>
      </div>
    )
  }

  const photos = trip.photos ?? []

  const openLightboxAt = (photoId: string) => {
    const photoIndex = photos.findIndex((photo) => photo.id === photoId)
    setLightboxIndex(photoIndex >= 0 ? photoIndex : 0)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <TripHeroBanner trip={trip} photoCount={photos.length} />

      <div className="mx-auto max-w-screen-xl">
        <TripTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6 px-6 pb-6">
          {activeTab === "grid" && (
            <PhotoGrid
              photos={photos}
              isLoading={false}
              onPhotoClick={(_, index) => setLightboxIndex(index)}
              readOnly
            />
          )}
          {activeTab === "timeline" && (
            <TripTimeline
              photos={photos}
              onPhotoClick={(photo) => openLightboxAt(photo.id)}
            />
          )}
          {activeTab === "map" && <TripMapView photos={photos} />}
        </div>
      </div>

      <PhotoLightbox
        photos={photos}
        initialIndex={lightboxIndex >= 0 ? lightboxIndex : 0}
        open={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        readOnly
      />

      <SharedAlbumFooter />
    </div>
  )
}
