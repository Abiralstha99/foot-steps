import { useState } from "react"
import { Check, MessageSquare } from "lucide-react"
import type { Photo } from "@/app/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { useAppDispatch } from "@/app/hooks"
import { removePhoto } from "@/features/photos/photosSlice"
import { AiTagBadge } from "./AiTagBadge"
import { SelectionBar } from "./SelectionBar"
import { BulkDeleteConfirmDialog } from "./BulkDeleteConfirmDialog"
import api from "@/lib/api"

type PhotoGridProps = {
  photos: Photo[]
  isLoading?: boolean
  onPhotoClick?: (photo: Photo, index: number) => void
  onPhotosDeleted?: (ids: string[]) => void | Promise<void>
  readOnly?: boolean
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

export function PhotoGrid({
  photos,
  isLoading = false,
  onPhotoClick,
  onPhotosDeleted,
  readOnly = false,
}: PhotoGridProps) {
  const dispatch = useAppDispatch()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isSelecting = selectedIds.size > 0

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleCellClick = (photo: Photo, index: number) => {
    if (!readOnly && isSelecting) {
      toggleSelect(photo.id)
    } else {
      onPhotoClick?.(photo, index)
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!readOnly) toggleSelect(id)
  }

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds)
    setIsDeleting(true)
    try {
      if (onPhotosDeleted) {
        await onPhotosDeleted(ids)
        setSelectedIds(new Set())
        setConfirmOpen(false)
      } else {
        await Promise.all(ids.map((id) => api.delete(`/photos/${id}`)))
        ids.forEach((id) => dispatch(removePhoto(id)))
        setSelectedIds(new Set())
        setConfirmOpen(false)
      }
    } catch {
      // Keep selection intact on error so user can retry
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, idx) => (
          <Skeleton key={idx} className="aspect-square w-full rounded-none" />
        ))}
      </div>
    )
  }

  if (!photos || photos.length === 0) {
    return (
      <EmptyState
        illustration={<NoPhotosIllustration />}
        headline="No photos yet"
        subline="Upload photos to start building your trip memories."
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-3">
        {photos.map((photo, index) => {
          const src = photo.url ?? ""
          const isSelected = selectedIds.has(photo.id)
          const tags = (photo.aiTags ?? []).slice(0, 3)

          return (
            <div
              key={photo.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCellClick(photo, index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCellClick(photo, index)
              }}
              className="group relative aspect-square cursor-pointer overflow-hidden"
            >
              {/* Photo */}
              <img
                src={src}
                alt={photo.caption || "Trip photo"}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />

              {/* Dark hover overlay */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-200",
                  isSelected
                    ? "bg-accent/20 opacity-100"
                    : "bg-black/40 opacity-0 group-hover:opacity-100"
                )}
              />

              {/* Checkbox — top-left (hidden in readOnly mode) */}
              {!readOnly && (
                <div
                  className={cn(
                    "absolute top-2 left-2 transition-opacity duration-150",
                    isSelecting ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                  onClick={(e) => handleCheckboxClick(e, photo.id)}
                >
                  <div
                    className={cn(
                      "flex size-5 items-center justify-center rounded border-2 transition-colors",
                      isSelected
                        ? "border-accent bg-accent"
                        : "border-white/90 bg-black/30"
                    )}
                  >
                    {isSelected && <Check className="size-3 text-white" />}
                  </div>
                </div>
              )}

              {/* Bottom overlay — AI tags + caption indicator */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-end justify-between gap-1">
                  {/* AI tag badges */}
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <AiTagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                  {/* Caption indicator */}
                  {photo.caption && (
                    <MessageSquare className="size-4 shrink-0 text-white/80" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selection bar */}
      {!readOnly && isSelecting && (
        <SelectionBar
          count={selectedIds.size}
          onDelete={() => setConfirmOpen(true)}
          onCancel={() => setSelectedIds(new Set())}
        />
      )}

      {/* Bulk delete confirmation */}
      {!readOnly && (
        <BulkDeleteConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          count={selectedIds.size}
          onConfirm={handleBulkDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}
