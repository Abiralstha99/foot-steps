import { useEffect, useMemo, useRef, useState } from "react"
import { Edit2, Loader2, Save, X } from "lucide-react"
import { CAPTION_MAX_LEN } from "@/lib/constant"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type CaptionEditorProps = {
  caption: string | null
  onSave: (newCaption: string) => Promise<void>
  readonly?: boolean
}

export function CaptionEditor({ caption, onSave, readonly = false }: CaptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(caption ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (isEditing) return
    setText(caption ?? "")
    setError(null)
  }, [caption, isEditing])

  useEffect(() => {
    if (!isEditing) return
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [text, isEditing])

  const normalized = useMemo(() => text.replace(/\r\n/g, "\n"), [text])
  const charCount = normalized.length
  const isOverLimit = charCount > CAPTION_MAX_LEN

  const startEdit = () => {
    if (readonly) return
    setIsEditing(true)
    setError(null)
    queueMicrotask(() => textareaRef.current?.focus())
  }

  const cancelEdit = () => {
    setText(caption ?? "")
    setError(null)
    setIsEditing(false)
  }

  const save = async () => {
    if (readonly || isSaving) return
    if (isOverLimit) {
      setError(`Caption must be ${CAPTION_MAX_LEN} characters or fewer.`)
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      await onSave(normalized.trim())
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.message ?? "Failed to save caption.")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Caption</h3>
          {!readonly && (
            <Button type="button" variant="ghost" size="sm" onClick={startEdit}>
              <Edit2 className="size-4" />
              Edit
            </Button>
          )}
        </div>
        {caption?.trim() ? (
          <p className="text-sm text-text-primary whitespace-pre-wrap">{caption}</p>
        ) : (
          <p className="text-sm text-text-muted">No caption provided</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-primary">Caption</h3>
        <div className="text-xs text-text-muted">
          <span className={isOverLimit ? "text-red-400" : undefined}>
            {Math.min(charCount, CAPTION_MAX_LEN)}
          </span>
          /{CAPTION_MAX_LEN}
        </div>
      </div>

      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={CAPTION_MAX_LEN + 50}
        placeholder="Write a caption..."
        className="min-h-[88px] resize-none"
        disabled={isSaving}
      />

      {error && (
        <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={cancelEdit}
          disabled={isSaving}
        >
          <X className="size-4" />
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={save}
          disabled={isSaving || isOverLimit}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
