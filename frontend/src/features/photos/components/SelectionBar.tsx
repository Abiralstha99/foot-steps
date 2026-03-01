import { Button } from "@/components/ui/button"

type SelectionBarProps = {
  count: number
  onDelete: () => void
  onCancel: () => void
}

export function SelectionBar({ count, onDelete, onCancel }: SelectionBarProps) {
  return (
    <div className="fixed bottom-0 left-[52px] right-0 z-20 bg-bg-surface border-t border-border-token">
      <div className="h-14 px-6 flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          {count} photo{count !== 1 ? "s" : ""} selected
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
