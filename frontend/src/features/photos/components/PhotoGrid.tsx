import { Image as ImageIcon } from "lucide-react"

import type { Photo } from "@/app/types"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type PhotoGridProps = {
  photos: Photo[]
  isLoading?: boolean
  onPhotoClick?: (photo: Photo) => void
}

export function PhotoGrid({ photos, isLoading = false, onPhotoClick }: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="h-12 w-12 text-[#9A9C9B] opacity-70" />
        <p className="mt-4 text-sm text-[#9A9C9B]">No photos yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => {
        const tagCount = photo.aiTags?.length ?? 0
        const caption = photo.caption ?? ""
        const src = photo.viewUrl ?? photo.url

        return (
          <div
            key={photo.id}
            role="button"
            tabIndex={0}
            onClick={() => onPhotoClick?.(photo)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onPhotoClick?.(photo)
            }}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
          >
            <img
              src={src}
              alt={caption || "Trip photo"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex justify-end">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  ✨ {tagCount}
                </Badge>
              </div>

              {caption && (
                <p className="text-sm text-white line-clamp-2">{caption}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
