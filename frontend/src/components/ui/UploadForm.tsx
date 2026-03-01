import React, { useRef, useState } from "react"
import { AlertCircle, Check, Loader2, UploadCloud, X } from "lucide-react"

import { useAppSelector } from "@/app/hooks"
import { selectUploadsById, useUpload } from "@/features/uploads/useUpload"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type FileEntry = {
  file: File
  uploadId: string
}

type UploadFormProps = {
  tripId: string
  onClose?: () => void
  onUploadComplete?: () => void | Promise<void>
}

function UploadForm({ tripId, onClose, onUploadComplete }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { uploadFile } = useUpload()
  const uploadsById = useAppSelector(selectUploadsById)

  const statuses = fileEntries.map((e) => uploadsById[e.uploadId]?.status ?? "uploading")
  const isUploading = statuses.some((s) => s === "uploading")
  const hasFiles = fileEntries.length > 0
  const allDone = hasFiles && !isUploading

  const doneCount = statuses.filter((s) => s === "done").length
  const totalEntries = fileEntries.length

  const totalProgress =
    totalEntries > 0
      ? Math.round(
          fileEntries.reduce((sum, e) => sum + (uploadsById[e.uploadId]?.progress ?? 0), 0) /
            totalEntries
        )
      : 0

  const startUploads = (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"))
    if (!imageFiles.length) return

    const entries: FileEntry[] = imageFiles.map((file) => ({
      file,
      uploadId: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }))

    setFileEntries((prev) => [...prev, ...entries])

    for (const entry of entries) {
      uploadFile({
        endpoint: `/trips/${tripId}/photos`,
        file: entry.file,
        uploadId: entry.uploadId,
      }).catch(() => {
        // Error state stored in Redux — read via uploadsById[entry.uploadId]
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    startUploads(Array.from(e.dataTransfer.files))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    startUploads(Array.from(e.target.files))
    e.target.value = ""
  }

  const handleDone = async () => {
    const anySuccess = statuses.some((s) => s === "done")
    if (anySuccess) await onUploadComplete?.()
    onClose?.()
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isUploading) onClose?.() }}>
      <DialogContent className="max-w-[560px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-token px-6 py-4">
          <DialogTitle className="font-display text-heading font-semibold text-text-primary">
            Add Photos
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => !isUploading && onClose?.()}
            disabled={isUploading}
            aria-label="Close"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors",
              isDragging
                ? "border-accent bg-accent-subtle"
                : "border-border-token hover:border-accent/50 hover:bg-bg-raised/50"
            )}
          >
            <UploadCloud
              className={cn("mb-3 size-8", isDragging ? "text-accent" : "text-text-muted")}
            />
            <p className="text-subheading text-text-secondary">Drop photos here</p>
            <p className="mt-1 text-body text-accent underline">or click to browse</p>
            <p className="mt-3 text-xs text-text-muted">JPG, PNG, WebP supported</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Per-file list */}
          {hasFiles && (
            <div className="max-h-48 overflow-y-auto rounded-lg border border-border-token">
              {fileEntries.map(({ file, uploadId }) => {
                const upload = uploadsById[uploadId]
                const progress = upload?.progress ?? 0
                const status = upload?.status ?? "uploading"

                return (
                  <div
                    key={uploadId}
                    className="flex items-center gap-3 border-b border-border-token px-3 py-2 last:border-b-0"
                  >
                    {/* Name + size */}
                    <div className="min-w-0 flex-1">
                      <p className="max-w-[200px] truncate text-sm text-text-primary">
                        {file.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>

                    {/* Per-file progress bar */}
                    <div className="w-24 flex-shrink-0">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
                        <div
                          className={cn(
                            "h-full transition-[width] duration-150",
                            status === "error" ? "bg-red-400" : "bg-accent"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status icon */}
                    <div className="size-4 flex-shrink-0">
                      {status === "uploading" && (
                        <Loader2 className="size-4 animate-spin text-text-muted" />
                      )}
                      {status === "done" && <Check className="size-4 text-emerald-500" />}
                      {status === "error" && <AlertCircle className="size-4 text-red-400" />}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Total progress bar — only shown when multiple files */}
          {totalEntries > 1 && (
            <div className="space-y-1.5">
              <p className="text-xs text-text-muted">
                {isUploading
                  ? `Uploading ${totalEntries - doneCount} of ${totalEntries}…`
                  : `${doneCount} of ${totalEntries} uploaded`}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
                <div
                  className="h-full bg-accent transition-[width] duration-150"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border-token px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => !isUploading && onClose?.()}
            disabled={isUploading}
          >
            Cancel
          </Button>
          {allDone && <Button onClick={handleDone}>Done</Button>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadForm
