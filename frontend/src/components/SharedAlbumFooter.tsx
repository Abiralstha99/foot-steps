import { Plane } from "lucide-react"

export function SharedAlbumFooter() {
  return (
    <footer className="mt-16 border-t border-border-token bg-bg-surface py-6 px-6">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <span className="flex items-center gap-2 text-small text-text-muted">
          <Plane className="size-4" />
          Made with Footprint
        </span>
        <a href="/" className="text-small text-accent hover:underline">
          Create your own
        </a>
      </div>
    </footer>
  )
}
