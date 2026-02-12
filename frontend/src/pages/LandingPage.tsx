import { Link } from "react-router-dom"
import { CalendarClock, MapPin, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070807] text-white">
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        {/* Subtle gradient + placeholder "image" layer */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(60,71,65,0.35),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-[#070807]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>

        <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Footsteps: Turn your scattered photos into a mapped journey.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#9A9C9B] sm:text-lg">
              Automatically organize your trip into a timeline and map-based album, enriched
              with landmark context, so it feels effortless to relive and share.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-[#3C4741] text-white hover:bg-[#4a5850]"
              >
                <Link to="/login">Get started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/10 bg-black/20 text-white hover:bg-white/5 hover:text-white"
              >
                <a href="#features">See features</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A9C9B]">
            Built for storytelling
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Everything you need for a trip album that makes sense.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-[#3C4741]/15 p-3 text-[#3C4741]">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Automatic Mapping</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9A9C9B]">
              Photos with GPS data appear as pins, so you can browse your trip by place.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-[#3C4741]/15 p-3 text-[#3C4741]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Landmark Tagging</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9A9C9B]">
              Spot landmarks and scene types automatically to add context to your memories.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-6">
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-[#3C4741]/15 p-3 text-[#3C4741]">
              <CalendarClock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Timeline View</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#9A9C9B]">
              Auto-group photos by day so your story flows naturally from start to finish.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

