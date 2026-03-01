import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { TripHeroBanner } from "@/features/trips/components/TripHeroBanner"
import { TripTabBar, type TripTab } from "@/features/trips/components/TripTabBar"
import { UploadFAB } from "@/features/trips/components/UploadFAB"
import { EditTripModal } from "@/features/trips/components/EditTripForm"
import UploadForm from "@/components/ui/UploadForm"
import { TripMapView } from "@/features/trips/components/TripMapView"
import { TripTimeline } from "@/features/trips/components/TripTimeline"
import { ShareDialog } from "@/features/trips/components/ShareDialog"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { PhotoLightbox } from "@/features/photos/components/PhotoLightbox"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  useGetPhotosQuery,
  useUpdateCaptionMutation,
  useDeletePhotoMutation,
} from "@/features/photos/api/tripPhotosApi"
import {
  useGetTripQuery,
  useUpdateCoverPhotoMutation,
  useRemoveCoverPhotoMutation,
} from "@/features/trips/tripsApi"
import api from "@/lib/api"

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
  const [shareOpen, setShareOpen] = useState(false)
  const [coverDialogOpen, setCoverDialogOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverProgress, setCoverProgress] = useState(0)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [isSavingCover, setIsSavingCover] = useState(false)

  const { data: photos = [], refetch: refetchPhotos } = useGetPhotosQuery(tripId ?? "", {
    skip: !tripId,
  })
  const [updateCaption] = useUpdateCaptionMutation()
  const [deletePhotoMutation] = useDeletePhotoMutation()

  const {
    data: trip,
    isLoading: isTripLoading,
    error: tripError,
    refetch: refetchTrip,
  } = useGetTripQuery(tripId ?? "", {
    skip: !tripId,
  })

  const [updateCoverPhoto] = useUpdateCoverPhotoMutation()
  const [removeCoverPhoto] = useRemoveCoverPhotoMutation()

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    if (!tripId) return
    await updateCaption({ photoId, caption, tripId }).unwrap()
  }

  const handlePhotosDeleted = async (ids: string[]) => {
    if (!tripId) return
    for (const photoId of ids) {
      await deletePhotoMutation({ photoId, tripId }).unwrap()
    }
  }

  const handlePhotoDeleted = async (id: string) => {
    if (!tripId) return
    await deletePhotoMutation({ photoId: id, tripId }).unwrap()
  }

  const openCoverDialog = () => {
    setCoverFile(null)
    setCoverProgress(0)
    setCoverError(null)
    setCoverDialogOpen(true)
  }

  const handleSaveCover = async () => {
    if (!trip || !tripId) return
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

      const photoId = uploadRes.data?.id as string | undefined
      if (!photoId) throw new Error("No photo ID returned from upload")

      await updateCoverPhoto({ id: tripId, coverPhotoId: photoId }).unwrap()
      setCoverDialogOpen(false)
      await refetchPhotos()
    } catch (err: unknown) {
      setCoverError(extractErrorMessage(err, "Failed to update cover photo"))
    } finally {
      setIsSavingCover(false)
    }
  }

  const handleRemoveCover = async () => {
    if (!tripId) return
    setIsSavingCover(true)
    setCoverError(null)
    try {
      await removeCoverPhoto({ id: tripId }).unwrap()
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

  const loadErrorMessage =
    tripError != null ? extractErrorMessage(tripError as unknown, "Failed to load trip") : null

  if (isTripLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!trip || tripError) {
    return (
      <div className="py-12">
        <h1 className="font-display text-heading text-text-primary">Trip not found</h1>
        <p className="mt-2 text-body text-text-muted">
          {loadErrorMessage ? `Error: ${loadErrorMessage}` : "We couldn't find that trip."}
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
          photoCount={photos.length}
          onEdit={() => setEditOpen(true)}
          onShare={() => setShareOpen(true)}
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
            photos={photos}
            isLoading={false}
            onPhotoClick={(_, index) => setLightboxIndex(index)}
            onPhotosDeleted={handlePhotosDeleted}
          />
        )}
        {activeTab === "timeline" && (
          <TripTimeline
            tripId={tripId ?? undefined}
            onPhotoClick={(photo) => {
              const idx = photos.findIndex((p) => p.id === photo.id)
              setLightboxIndex(idx >= 0 ? idx : 0)
            }}
          />
        )}
        {activeTab === "map" && <TripMapView photos={photos} />}
      </div>

      {/* Upload FAB */}
      <UploadFAB onClick={() => setUploadOpen(true)} />

      {/* Photo lightbox */}
      <PhotoLightbox
        photos={photos}
        initialIndex={lightboxIndex >= 0 ? lightboxIndex : 0}
        open={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        onUpdateCaption={handleUpdateCaption}
        onPhotoDeleted={handlePhotoDeleted}
      />

      {/* Upload form */}
      {uploadOpen && tripId && (
        <UploadForm
          tripId={tripId}
          onClose={() => setUploadOpen(false)}
          onUploadComplete={async () => {
            await refetchPhotos()
            setUploadOpen(false)
          }}
        />
      )}

      {/* Edit trip modal */}
      {editOpen && trip && (
        <EditTripModal
          trip={trip}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={() => refetchTrip()}
        />
      )}

      {/* Share dialog */}
      {shareOpen && trip && (
        <ShareDialog
          trip={trip}
          open={shareOpen}
          onOpenChange={setShareOpen}
          onShareTokenChange={async () => {
            await refetchTrip()
          }}
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

            {(coverPreviewSrc || trip.coverUrl) && (
              <div className="overflow-hidden rounded-lg border border-border-token">
                <img
                  src={coverPreviewSrc ?? trip.coverUrl ?? ""}
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
              <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {coverError}
              </p>
            )}

            <div className="flex justify-end gap-2 border-t border-border-token pt-4">
              <Button
                variant="ghost"
                onClick={handleRemoveCover}
                disabled={isSavingCover}
              >
                Remove
              </Button>
              <Button variant="ghost" onClick={() => setCoverDialogOpen(false)}>
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

