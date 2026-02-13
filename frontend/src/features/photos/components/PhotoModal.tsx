import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { Calendar, Edit2, Loader2, MapPin, Save, Tag, X } from "lucide-react"

import type { Photo } from "@/app/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

type PhotoWithOptionalExif = Photo & {
  exif?: {
    camera?: string | null
    aperture?: string | null
  } | null
}

export interface PhotoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  photo: PhotoWithOptionalExif | null
  onUpdateCaption: (photoId: string, caption: string) => Promise<void>
}

export function PhotoModal({ open, onOpenChange, photo, onUpdateCaption }: PhotoModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [captionText, setCaptionText] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [localCaption, setLocalCaption] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setIsEditing(false)
    const nextCaption = photo?.caption ?? ""
    setCaptionText(nextCaption)
    setLocalCaption(photo?.caption ?? null)
  }, [open, photo?.id])

  const tags = useMemo(() => photo?.aiTags ?? [], [photo?.aiTags])
  const tagCount = tags.length

  const takenAtLabel = useMemo(() => {
    if (!photo?.takenAt) return null
    const d = new Date(photo.takenAt)
    if (Number.isNaN(d.getTime())) return null
    return format(d, "MMM dd, yyyy")
  }, [photo?.takenAt])

  const coordsLabel = useMemo(() => {
    if (photo?.latitude == null || photo?.longitude == null) return null
    return `Latitude: ${photo.latitude.toFixed(4)}, Longitude: ${photo.longitude.toFixed(4)}`
  }, [photo?.latitude, photo?.longitude])

  const close = () => onOpenChange(false)

  const handleCancelEdit = () => {
    setCaptionText(localCaption ?? "")
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!photo) return
    const nextCaption = captionText.trim().slice(0, 500)
    const previous = localCaption

    setIsSaving(true)
    setLocalCaption(nextCaption || null) // optimistic UI
    try {
      await onUpdateCaption(photo.id, nextCaption)
      setIsEditing(false)
    } catch (err) {
      setLocalCaption(previous ?? null)
      setCaptionText(previous ?? "")
      alert("Failed to save caption.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/95 border-zinc-800 overflow-hidden"
      >
        <DialogTitle className="sr-only">Photo details</DialogTitle>

        <div className="flex h-full flex-col md:flex-row">
          {/* Left: Image */}
          <div className="relative flex flex-1 items-center justify-center bg-black">
            {photo?.viewUrl || photo?.url ? (
              <img
                src={(photo.viewUrl ?? photo.url) as string}
                alt={localCaption || "Photo"}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-sm text-[#9A9C9B]">No photo selected</div>
            )}
          </div>

          {/* Right: Sidebar */}
          <aside className="relative w-full flex-shrink-0 border-l border-zinc-800 bg-[#09090b] md:w-[320px] lg:w-[360px]">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={close}
              className="absolute right-3 top-3 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>

            <ScrollArea className="h-full px-5 py-5 pr-4">
              {/* Caption */}
              <section className="pt-10 md:pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Caption</h3>
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>

                {!isEditing ? (
                  <p className="mt-2 text-sm text-white/90">
                    {localCaption?.trim()
                      ? localCaption
                      : <span className="text-[#9A9C9B]">No caption provided</span>}
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    <Textarea
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      maxLength={500}
                      className="min-h-[120px]"
                      placeholder="Write a caption..."
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/10 bg-black/20 text-white hover:bg-white/5 hover:text-white"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="bg-[#3C4741] text-white hover:bg-[#4a5850]"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              {/* AI Tags */}
              <section className="mt-8">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-white/70" />
                  <h3 className="text-sm font-semibold text-white">AI Tags</h3>
                  <span className="text-xs text-[#9A9C9B]">({tagCount})</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="bg-white/10 text-white hover:bg-white/15"
                      >
                        {t}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-[#9A9C9B]">No tags</span>
                  )}
                </div>
              </section>

              {/* Details */}
              <section className="mt-8">
                <h3 className="text-sm font-semibold text-white">Details</h3>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-start gap-3 text-white/90">
                    <MapPin className="mt-0.5 h-4 w-4 text-white/70" />
                    <div>
                      <div className="font-medium text-white">Location</div>
                      <div className="text-[#9A9C9B]">
                        {coordsLabel ?? "No GPS data"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-white/90">
                    <Calendar className="mt-0.5 h-4 w-4 text-white/70" />
                    <div>
                      <div className="font-medium text-white">Date</div>
                      <div className="text-[#9A9C9B]">
                        {takenAtLabel ?? "Unknown"}
                      </div>
                    </div>
                  </div>

                  {(photo?.exif?.camera || photo?.exif?.aperture) && (
                    <div className="flex items-start gap-3 text-white/90">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center text-white/70">
                        {/* Using a simple glyph to avoid adding optional icons */}
                        <span className="text-xs">EX</span>
                      </span>
                      <div>
                        <div className="font-medium text-white">EXIF</div>
                        <div className="text-[#9A9C9B]">
                          {photo.exif?.camera ? `Camera: ${photo.exif.camera}` : null}
                          {photo.exif?.camera && photo.exif?.aperture ? " • " : null}
                          {photo.exif?.aperture ? `Aperture: ${photo.exif.aperture}` : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </ScrollArea>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}
