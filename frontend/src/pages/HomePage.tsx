import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function HomePage() {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-app-text-muted">
          Travel Photo Journal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-app-text sm:text-4xl lg:text-5xl">
          Rediscover every journey in{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-app-accent to-app-text-muted bg-clip-text text-transparent">
            cinematic detail
          </span>
          .
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-app-text-muted sm:text-base">
          Curate your favorite travel moments, pin them to a map, and build a
          living archive of the stories behind every photo you capture on the
          road.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          className="bg-app-accent text-white hover:bg-app-accent-hover"
        >
          <Link to="/trips">Start a new trip</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-app-border bg-transparent text-app-text hover:bg-app-nav-hover"
        >
          <Link to="/trips">Browse past journeys</Link>
        </Button>
      </div>
    </div>
  )
}
