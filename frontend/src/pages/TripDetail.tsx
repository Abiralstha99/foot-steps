import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import TripHeader from "@/features/trips/components/TripHeader"
import UploadForm from "@/components/ui/UploadForm"
import api from "@/lib/api"
import type { Photo, Trip } from "@/app/types"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { PhotoModal } from "@/features/photos/components/PhotoModal"
import { useUpdatePhoto } from "@/features/photos/usePhotos"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/DatePicker"

type TripWithPhotos = Trip & { photos: Photo[] }

export function TripDetailPage() {
  const { id: tripId } = useParams<{ id: string }>()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [coverDialogOpen, setCoverDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [trip, setTrip] = useState<TripWithPhotos | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverProgress, setCoverProgress] = useState(0)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [isSavingCover, setIsSavingCover] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const { updatePhotoCaption } = useUpdatePhoto()

  const toMmDdYyyy = (value?: string | null) => {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const yyyy = date.getFullYear()
    return `${mm}/${dd}/${yyyy}`
  }

  const parseMmDdYyyy = (value: string) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
    if (!match) return null
    const [, mm, dd, yyyy] = match
    const month = Number(mm) - 1
    const day = Number(dd)
    const year = Number(yyyy)
    const d = new Date(year, month, day)
    if (Number.isNaN(d.getTime())) return null
    if (d.getMonth() !== month || d.getDate() !== day || d.getFullYear() !== year) return null
    return d
  }

  const toIsoDate = (value: string) => {
    const d = parseMmDdYyyy(value)
    if (!d) return null
    return d.toISOString().slice(0, 10)
  }

  const openCoverDialog = () => {
    setCoverFile(null)
    setCoverProgress(0)
    setCoverError(null)
    setCoverDialogOpen(true)
  }

  const openEditDialog = () => {
    if (!trip) return
    setEditForm({
      name: trip.name ?? "",
      description: trip.description ?? "",
      startDate: toMmDdYyyy(trip.startDate),
      endDate: toMmDdYyyy(trip.endDate),
    })
    setEditError(null)
    setEditDialogOpen(true)
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
          ? {
              ...prev,
              coverPhotoUrl: s3Key,
              coverViewUrl: coverViewUrl ?? prev.coverViewUrl ?? null,
            }
          : prev
      )
      setCoverDialogOpen(false)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Failed to update cover photo"
      setCoverError(message)
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
      setTrip((prev) =>
        prev ? { ...prev, coverPhotoUrl: null, coverViewUrl: null } : prev
      )
      setCoverDialogOpen(false)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Failed to remove cover photo"
      setCoverError(message)
    } finally {
      setIsSavingCover(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!trip) return
    if (!editForm.name.trim()) {
      setEditError("Trip name is required.")
      return
    }
    if (!editForm.startDate || !editForm.endDate) {
      setEditError("Start date and end date are required.")
      return
    }
    const startIso = toIsoDate(editForm.startDate)
    const endIso = toIsoDate(editForm.endDate)
    if (!startIso || !endIso) {
      setEditError("Please enter valid dates.")
      return
    }
    if (new Date(startIso) > new Date(endIso)) {
      setEditError("End date must be on or after start date.")
      return
    }

    setIsSavingEdit(true)
    setEditError(null)
    try {
      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        startDate: startIso,
        endDate: endIso,
      }
      const res = await api.patch(`/trips/${trip.id}`, payload)
      const updated = res.data as Trip
      setTrip((prev) => (prev ? { ...prev, ...updated, coverViewUrl: prev.coverViewUrl ?? null } : prev))
      setEditDialogOpen(false)
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Failed to update trip"
      setEditError(message)
    } finally {
      setIsSavingEdit(false)
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

  const refreshTrip = async (id: string) => {
    const res = await api.get(`/trips/${id}`)
    setTrip(res.data as TripWithPhotos)
  }

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
        onChangeCover={openCoverDialog}
        onEdit={openEditDialog}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <PhotoGrid
          photos={trip.photos ?? []}
          isLoading={isLoading}
          onPhotoClick={(photo) => setSelectedPhoto(photo)}
        />
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
          onUploadComplete={async () => {
            await refreshTrip(tripId)
            setUploadOpen(false)
          }}
        />
      )}

      <Dialog open={coverDialogOpen} onOpenChange={setCoverDialogOpen}>
        <DialogContent className="max-w-md border-[#2d302e] bg-[#0d0e0d] p-0">
          <div className="border-b border-[#2d302e] px-6 py-4">
            <DialogTitle className="text-white">Change cover photo</DialogTitle>
          </div>
          <div className="space-y-4 px-6 py-4">
            <div>
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
                className="block w-full cursor-pointer rounded-md border border-[#2d302e] bg-[#090a09] px-3 py-2 text-sm text-[#9A9C9B] file:mr-3 file:rounded file:border-0 file:bg-[#3C4741] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#4a5a52]"
              />
            </div>

            {(coverPreviewSrc || trip.coverViewUrl) && (
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
                <img
                  src={coverPreviewSrc ?? trip.coverViewUrl ?? ""}
                  alt="Cover preview"
                  className="h-40 w-full object-cover"
                />
              </div>
            )}

            {isSavingCover && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9A9C9B]">
                  <span>Uploading...</span>
                  <span>{coverProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#1a1b1a]">
                  <div
                    className="h-full bg-[#3C4741] transition-[width] duration-300"
                    style={{ width: `${coverProgress}%` }}
                  />
                </div>
              </div>
            )}

            {coverError && (
              <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">{coverError}</p>
            )}
            <div className="flex justify-end gap-2 border-t border-[#2d302e] pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveCover}
                disabled={isSavingCover}
                className="border-[#2d302e] bg-transparent text-[#9A9C9B] hover:bg-[#1a1b1a] hover:text-white"
              >
                Remove
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCoverDialogOpen(false)}
                className="border-[#2d302e] bg-transparent text-[#9A9C9B] hover:bg-[#1a1b1a] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveCover}
                disabled={isSavingCover}
                className="bg-[#3C4741] text-white hover:bg-[#4a5a52]"
              >
                {isSavingCover ? "Uploading..." : "Upload & set cover"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md border-[#2d302e] bg-[#0d0e0d] p-0">
          <div className="border-b border-[#2d302e] px-6 py-4">
            <DialogTitle className="text-white">Edit trip</DialogTitle>
          </div>
          <div className="space-y-4 px-6 py-4">
            <div>
              <label htmlFor="trip-name" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                Trip name
              </label>
              <input
                id="trip-name"
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-[#2d302e] bg-[#090a09] px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:border-[#3C4741] focus:outline-none focus:ring-1 focus:ring-[#3C4741]"
              />
            </div>
            <div>
              <label htmlFor="trip-description" className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                Location / description
              </label>
              <input
                id="trip-description"
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-md border border-[#2d302e] bg-[#090a09] px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:border-[#3C4741] focus:outline-none focus:ring-1 focus:ring-[#3C4741]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                  Start date
                </label>
                <DatePicker
                  value={editForm.startDate}
                  onChange={(value) => setEditForm((prev) => ({ ...prev, startDate: value }))}
                  placeholder="MM/DD/YYYY"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#9A9C9B]">
                  End date
                </label>
                <DatePicker
                  value={editForm.endDate}
                  onChange={(value) => setEditForm((prev) => ({ ...prev, endDate: value }))}
                  placeholder="MM/DD/YYYY"
                />
              </div>
            </div>
            {editError && (
              <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">{editError}</p>
            )}
            <div className="flex justify-end gap-2 border-t border-[#2d302e] pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-[#2d302e] bg-transparent text-[#9A9C9B] hover:bg-[#1a1b1a] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="bg-[#3C4741] text-white hover:bg-[#4a5a52]"
              >
                {isSavingEdit ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
