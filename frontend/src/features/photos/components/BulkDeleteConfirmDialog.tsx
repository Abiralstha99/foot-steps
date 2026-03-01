import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type BulkDeleteConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export function BulkDeleteConfirmDialog({
  open,
  onOpenChange,
  count,
  onConfirm,
  isDeleting,
}: BulkDeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <DialogContent className="max-w-sm p-0">
        <div className="border-b border-border-token px-6 py-4">
          <DialogTitle className="font-display text-subheading font-semibold text-text-primary">
            Delete {count} photo{count !== 1 ? "s" : ""}?
          </DialogTitle>
        </div>
        <div className="px-6 py-5">
          <p className="text-body text-text-secondary">
            This cannot be undone. The photo{count !== 1 ? "s" : ""} will be permanently removed.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                `Delete photo${count !== 1 ? "s" : ""}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
