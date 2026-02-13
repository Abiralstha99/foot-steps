import { useEffect, useMemo, useRef, useState } from "react"
import { Edit2, Loader2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type CaptionEditorProps = {
  caption: string | null
  onSave: (newCaption: string) => Promise<void>
  readonly?: boolean
}

const MAX_LEN = 500

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

    // Auto-resize: reset then grow to scrollHeight.
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [text, isEditing])

  const normalized = useMemo(() => text.replace(/\r\n/g, "\n"), [text])
  const charCount = normalized.length
  const isOverLimit = charCount > MAX_LEN

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
      setError(`Caption must be ${MAX_LEN} characters or fewer.`)
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
          <h3 className="text-sm font-semibold text-white">Caption</h3>
          {!readonly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={startEdit}
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {caption?.trim() ? (
          <p className="text-sm text-white/90 whitespace-pre-wrap">{caption}</p>
        ) : (
          <p className="text-sm text-[#9A9C9B]">No caption provided</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">Caption</h3>
        <div className="text-xs text-[#9A9C9B]">
          <span className={isOverLimit ? "text-red-400" : undefined}>
            {Math.min(charCount, MAX_LEN)}
          </span>
          /{MAX_LEN}
        </div>
      </div>

      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX_LEN + 50}
        placeholder="Write a caption..."
        className="min-h-[88px] resize-none"
        disabled={isSaving}
      />

      {error && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-black/20 text-white hover:bg-white/5 hover:text-white"
          onClick={cancelEdit}
          disabled={isSaving}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#3C4741] text-white hover:bg-[#4a5850]"
          onClick={save}
          disabled={isSaving || isOverLimit}
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
  )
}

