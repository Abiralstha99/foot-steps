import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TripHeader from "@/features/trips/components/TripHeader"
import { ViewModeSwitcher } from "@/features/trips/components/ViewModeSwitcher"
import type { ViewMode } from "@/features/trips/components/ViewModeSwitcher"
import UploadForm from "@/components/ui/UploadForm"
import api from "@/lib/api"
import type { Photo, Trip } from "@/app/types"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { PhotoModal } from "@/features/photos/components/PhotoModal"
import { useUpdatePhoto } from "@/features/photos/usePhotos"

type TripWithPhotos = Trip & { photos: Photo[] }

export function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const [activeMode, setActiveMode] = useState<ViewMode>("timeline")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [trip, setTrip] = useState<TripWithPhotos | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { updatePhotoCaption } = useUpdatePhoto()

  useEffect(() => {
    if (!tripId) return
    let cancelled = false

    const fetchTrip = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get(`/trips/${tripId}`)
        if (cancelled) return
        setTrip(res.data as TripWithPhotos)
      } catch (err: any) {
        if (cancelled) return
        const message =
          err?.response?.data?.message ?? err?.message ?? "Failed to load trip"
        setError(message)
        setTrip(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchTrip()
    return () => {
      cancelled = true
    }
  }, [tripId])

  if (isLoading) {
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
        onUploadPhotos={() => setUploadOpen(true)}
        onChangeCover={() => {
          // TODO: wire to real change-cover flow
          console.log("Change cover clicked for trip", trip.id)
        }}
        onEdit={() => {
          // TODO: wire to real edit flow
          console.log("Edit clicked for trip", trip.id)
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
          <PhotoGrid
            photos={trip.photos ?? []}
            isLoading={isLoading}
            onPhotoClick={(photo) => setSelectedPhoto(photo)}
          />
        )}
      </div>

      <PhotoModal
        photo={selectedPhoto}
        open={!!selectedPhoto}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null)
        }}
        onUpdateCaption={updatePhotoCaption}
      />

      {uploadOpen && tripId && (
        <UploadForm
          tripId={tripId}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </div>
  )
}
