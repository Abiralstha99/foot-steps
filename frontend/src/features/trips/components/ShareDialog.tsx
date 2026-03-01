import { useState } from "react"
import { Check, Copy, Link, Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import type { Trip } from "@/app/types"

type ShareDialogProps = {
  trip: Trip
  open: boolean
  onOpenChange: (open: boolean) => void
  onShareTokenChange?: (token: string | null) => void
}

export function ShareDialog({
  trip,
  open,
  onOpenChange,
  onShareTokenChange,
}: ShareDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [localToken, setLocalToken] = useState<string | null>(trip.shareToken ?? null)

  const shareUrl = localToken ? `${window.location.origin}/share/${localToken}` : null

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await api.post(`/trips/${trip.id}/share`)
      const token: string = res.data?.shareToken ?? res.data?.token
      setLocalToken(token)
      onShareTokenChange?.(token)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRevoke = async () => {
    setIsRevoking(true)
    try {
      await api.delete(`/trips/${trip.id}/share`)
      setLocalToken(null)
      onShareTokenChange?.(null)
    } finally {
      setIsRevoking(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <div className="border-b border-border-token px-6 py-4">
          <DialogTitle className="font-display text-subheading font-semibold text-text-primary">
            Share this trip
          </DialogTitle>
        </div>

        <div className="space-y-4 px-6 py-5">
          {!localToken ? (
            <div className="space-y-3">
              <p className="text-body text-text-secondary">
                Generate a public link anyone can use to view this trip — no account required.
              </p>
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Link className="size-4" />
                    Generate share link
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Share link
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl ?? ""}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="min-w-0 flex-1 rounded border border-border-token bg-bg-raised px-3 py-2 text-sm text-text-secondary focus:outline-none"
                  />
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="size-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border-t border-border-token pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRevoke}
                  disabled={isRevoking}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  {isRevoking ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Revoking…
                    </>
                  ) : (
                    "Revoke link"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
