import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { TripHeroBanner } from "@/features/trips/components/TripHeroBanner"
import { TripTabBar, type TripTab } from "@/features/trips/components/TripTabBar"
import { UploadFAB } from "@/features/trips/components/UploadFAB"
import { EditTripModal } from "@/features/trips/components/EditTripForm"
import UploadForm from "@/components/ui/UploadForm"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { PhotoModal } from "@/features/photos/components/PhotoModal"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUpdatePhoto } from "@/features/photos/usePhotos"
import api from "@/lib/api"
import type { Photo, Trip } from "@/app/types"

type TripWithPhotos = Trip & { photos: Photo[] }

function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const responseMsg = (err as { response?: { data?: { message?: string } } }).response?.data
      ?.message
    if (typeof responseMsg === "string") return responseMsg
    const msg = (err as { message?: string }).message
    if (typeof msg === "string") return msg
  }
  return fallback
}

export function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TripTab>("grid")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [coverDialogOpen, setCoverDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [trip, setTrip] = useState<TripWithPhotos | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverProgress, setCoverProgress] = useState(0)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [isSavingCover, setIsSavingCover] = useState(false)
  const { updatePhotoCaption } = useUpdatePhoto()

  const refreshTrip = async (id: string) => {
    const res = await api.get(`/trips/${id}`)
    setTrip(res.data as TripWithPhotos)
  }

  const openCoverDialog = () => {
    setCoverFile(null)
    setCoverProgress(0)
    setCoverError(null)
    setCoverDialogOpen(true)
  }

  const handleSaveCover = async () => {
    if (!trip) return
    if (!coverFile) {
      setCoverError("Please select a photo.")
      return
    }
    setIsSavingCover(true)
    setCoverProgress(0)
    setCoverError(null)
    try {
      const formData = new FormData()
      formData.append("photo", coverFile)

      const uploadRes = await api.post(`/trips/${trip.id}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const progress = e.total ? Math.round((e.loaded / e.total) * 100) : 0
          setCoverProgress(progress)
        },
      })

      const s3Key = uploadRes.data?.s3Key
      const coverViewUrl = uploadRes.data?.viewUrl
      if (!s3Key) throw new Error("No s3Key returned from upload")

      await api.patch(`/trips/${trip.id}`, { coverPhotoUrl: s3Key })
      setTrip((prev) =>
        prev
          ? { ...prev, coverPhotoUrl: s3Key, coverViewUrl: coverViewUrl ?? prev.coverViewUrl ?? null }
          : prev
      )
      setCoverDialogOpen(false)
    } catch (err: unknown) {
      setCoverError(extractErrorMessage(err, "Failed to update cover photo"))
    } finally {
      setIsSavingCover(false)
    }
  }

  const handleRemoveCover = async () => {
    if (!trip) return
    setIsSavingCover(true)
    setCoverError(null)
    try {
      await api.patch(`/trips/${trip.id}`, { coverPhotoUrl: null })
      setTrip((prev) => (prev ? { ...prev, coverPhotoUrl: null, coverViewUrl: null } : prev))
      setCoverDialogOpen(false)
    } catch (err: unknown) {
      setCoverError(extractErrorMessage(err, "Failed to remove cover photo"))
    } finally {
      setIsSavingCover(false)
    }
  }

  const coverPreviewSrc = useMemo(() => {
    if (!coverFile) return null
    return URL.createObjectURL(coverFile)
  }, [coverFile])

  useEffect(() => {
    return () => {
      if (coverPreviewSrc) URL.revokeObjectURL(coverPreviewSrc)
    }
  }, [coverPreviewSrc])

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
      } catch (err: unknown) {
        if (cancelled) return
        setError(extractErrorMessage(err, "Failed to load trip"))
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
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="py-12">
        <h1 className="font-display text-heading text-text-primary">Trip not found</h1>
        <p className="mt-2 text-body text-text-muted">
          {error ? `Error: ${error}` : "We couldn't find that trip."}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero — break out of AppLayout's px-6 py-8 to bleed to container edges */}
      <div className="-mx-6 -mt-8">
        <TripHeroBanner
          trip={trip}
          photoCount={trip.photos?.length}
          onEdit={() => setEditOpen(true)}
          onShare={() => {}}
          onChangeCover={openCoverDialog}
        />
      </div>

      {/* Tab bar — full width with bottom border */}
      <div className="-mx-6">
        <TripTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "grid" && (
          <PhotoGrid
            photos={trip.photos ?? []}
            isLoading={false}
            onPhotoClick={(photo) => setSelectedPhoto(photo)}
          />
        )}
        {activeTab === "timeline" && (
          <div className="py-16 text-center text-body text-text-muted">
            Timeline view is coming soon.
          </div>
        )}
        {activeTab === "map" && (
          <div className="py-16 text-center text-body text-text-muted">
            Map view is coming soon.
          </div>
        )}
      </div>

      {/* Upload FAB */}
      <UploadFAB onClick={() => setUploadOpen(true)} />

      {/* Photo viewer */}
      <PhotoModal
        photo={selectedPhoto}
        open={!!selectedPhoto}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null)
        }}
        onUpdateCaption={updatePhotoCaption}
      />

      {/* Upload form */}
      {uploadOpen && tripId && (
        <UploadForm
          tripId={tripId}
          onClose={() => setUploadOpen(false)}
          onUploadComplete={async () => {
            await refreshTrip(tripId)
            setUploadOpen(false)
          }}
        />
      )}

      {/* Edit trip modal */}
      {editOpen && (
        <EditTripModal
          trip={trip}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={() => tripId && refreshTrip(tripId)}
        />
      )}

      {/* Cover photo dialog */}
      <Dialog open={coverDialogOpen} onOpenChange={setCoverDialogOpen}>
        <DialogContent className="max-w-md p-0">
          <div className="border-b border-border-token px-6 py-4">
            <DialogTitle className="font-display text-subheading font-semibold text-text-primary">
              Change cover photo
            </DialogTitle>
          </div>
          <div className="space-y-4 px-6 py-5">
            <input
              id="cover-file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setCoverFile(file)
                setCoverError(null)
                setCoverProgress(0)
              }}
              className="block w-full cursor-pointer rounded border border-border-token bg-bg-base px-3 py-2 text-sm text-text-secondary file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-accent-hover"
            />

            {(coverPreviewSrc || trip.coverViewUrl) && (
              <div className="overflow-hidden rounded-lg border border-border-token">
                <img
                  src={coverPreviewSrc ?? trip.coverViewUrl ?? ""}
                  alt="Cover preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            {isSavingCover && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Uploading...</span>
                  <span>{coverProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-raised">
                  <div
                    className="h-full bg-accent transition-[width] duration-300"
                    style={{ width: `${coverProgress}%` }}
                  />
                </div>
              </div>
            )}

            {coverError && (
              <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">{coverError}</p>
            )}

            <div className="flex justify-end gap-2 border-t border-border-token pt-4">
              <Button
                variant="ghost"
                onClick={handleRemoveCover}
                disabled={isSavingCover}
              >
                Remove
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCoverDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveCover} disabled={isSavingCover}>
                {isSavingCover ? "Uploading..." : "Upload & set cover"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
