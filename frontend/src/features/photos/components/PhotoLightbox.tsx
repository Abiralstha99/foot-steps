import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Info, MapPin, Trash2, X } from "lucide-react"

import type { Photo } from "@/app/types"
import { useAppDispatch } from "@/app/hooks"
import { removePhoto } from "@/features/photos/photosSlice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { AiTagBadge } from "./AiTagBadge"
import { CaptionEditor } from "./CaptionEditor"
import { DeletePhotoConfirmDialog } from "./DeletePhotoConfirmDialog"

type Props = {
  photos: Photo[]
  initialIndex: number
  open: boolean
  onClose: () => void
  onUpdateCaption?: (photoId: string, caption: string) => Promise<void>
  onPhotoDeleted?: (id: string) => void
  readOnly?: boolean
}

export function PhotoLightbox({
  photos,
  initialIndex,
  open,
  onClose,
  onUpdateCaption,
  onPhotoDeleted,
  readOnly = false,
}: Props) {
  const dispatch = useAppDispatch()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Sync index and trigger entry animation when lightbox opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
      setIsInfoOpen(false)
      setDeleteOpen(false)
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
  }, [open, initialIndex])

  const photo = photos[currentIndex] ?? null
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (deleteOpen) return
      switch (e.key) {
        case "ArrowLeft":
          setCurrentIndex((i) => Math.max(0, i - 1))
          break
        case "ArrowRight":
          setCurrentIndex((i) => Math.min(photos.length - 1, i + 1))
          break
        case "Escape":
          if (isInfoOpen) {
            setIsInfoOpen(false)
          } else {
            onClose()
          }
          break
        case "i":
        case "I":
          setIsInfoOpen((v) => !v)
          break
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, isInfoOpen, deleteOpen, photos.length, onClose])

  const takenAtLabel = useMemo(() => {
    if (!photo?.takenAt) return null
    const d = new Date(photo.takenAt)
    if (Number.isNaN(d.getTime())) return null
    return format(d, "MMM d, yyyy")
  }, [photo?.takenAt])

  const coordsLabel = useMemo(() => {
    if (photo?.latitude == null || photo?.longitude == null) return null
    return `${photo.latitude.toFixed(4)}, ${photo.longitude.toFixed(4)}`
  }, [photo?.latitude, photo?.longitude])

  const handleDelete = async () => {
    if (!photo) return
    const id = photo.id
    await api.delete(`/photos/${id}`)
    dispatch(removePhoto(id))
    onPhotoDeleted?.(id)
    setDeleteOpen(false)
    if (photos.length <= 1) {
      onClose()
    } else {
      setCurrentIndex((i) => Math.min(i, photos.length - 2))
    }
  }

  if (!open) return null

  const src = photo?.url ?? ""

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Animated photo + metadata wrapper — pointer-events-none so backdrop clicks reach the parent */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.92)",
        }}
      >
        {/* Photo + hover metadata — pointer-events-auto to capture hover */}
        <div
          className="group relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {src ? (
            <img
              key={photo?.id}
              src={src}
              alt={photo?.caption || "Photo"}
              className="max-h-[90vh] max-w-[85vw] object-contain"
              draggable={false}
            />
          ) : (
            <div className="flex h-64 w-96 items-center justify-center text-sm text-white/50">
              No photo selected
            </div>
          )}

          {/* Metadata strip — hover reveal at bottom of photo */}
          {(takenAtLabel || coordsLabel) && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="flex items-center gap-3 text-xs">
                {takenAtLabel && <span className="text-white/70">{takenAtLabel}</span>}
                {coordsLabel && (
                  <span className="flex items-center gap-1 text-white/50">
                    <MapPin className="size-3" />
                    {coordsLabel}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-4 text-white/70 hover:bg-white/10 hover:text-white"
        aria-label="Close"
      >
        <X className="size-5" />
      </Button>

      {/* Prev arrow */}
      {hasPrev && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-7" />
        </Button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Next photo"
        >
          <ChevronRight className="size-7" />
        </Button>
      )}

      {/* Photo counter */}
      {photos.length > 1 && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/50">
          {currentIndex + 1} / {photos.length}
        </div>
      )}

      {/* Info toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsInfoOpen((v) => !v)}
        className={cn(
          "absolute bottom-4 right-4 hover:bg-white/10",
          isInfoOpen ? "text-white" : "text-white/70 hover:text-white"
        )}
        aria-label="Toggle info"
      >
        <Info className="size-5" />
      </Button>

      {/* Info drawer — slides up from bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[50vh] overflow-y-auto rounded-t-xl border-t border-border-token bg-bg-surface p-6 transition-transform duration-200"
        style={{ transform: isInfoOpen ? "translateY(0)" : "translateY(100%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {photo && (
          <div className="space-y-6">
            {/* AI Tags */}
            {(photo.aiTags?.length ?? 0) > 0 && (
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  AI Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {photo.aiTags!.map((tag) => (
                    <AiTagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            )}

            {/* Caption */}
            {!readOnly && onUpdateCaption && (
              <CaptionEditor
                key={photo.id}
                caption={photo.caption ?? null}
                onSave={(newCaption) => onUpdateCaption(photo.id, newCaption)}
              />
            )}
            {readOnly && photo.caption && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Caption
                </h4>
                <p className="text-body text-text-secondary">{photo.caption}</p>
              </div>
            )}

            {/* Delete */}
            {!readOnly && (
              <div className="border-t border-border-token pt-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Delete photo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <DeletePhotoConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  )
}
