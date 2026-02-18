import { CalendarClock, MapPin, Sparkles } from "lucide-react"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

function LandingNav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-white"
        >
          footsteps
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Log In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-[#3C4741] text-white hover:bg-[#4a5850]">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Button
              asChild
              className="bg-[#3C4741] text-white hover:bg-[#4a5850]"
            >
              <Link to="/home">Go to Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070807] text-white">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24">
        {/* Cinematic background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#070807]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2">
          {/* Left: Hero text */}
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A9C9B]">
              Travel Photo Journal
            </p>
            <h1 className="text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
              Footsteps: Turn your scattered photos into a{" "}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Mapped Journey
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#9A9C9B] sm:text-lg">
              Automatically organize your trip into timeline chapters and map moments.
              Relive where you went, when you were there, and what made each stop unforgettable.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button className="bg-[#217647] text-white hover:bg-[#4a5850]">
                    Start Your Journal
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  asChild
                  className="bg-[#3C4741] text-white hover:bg-[#4a5850]"
                >
                  <Link to="/home">Go to Dashboard</Link>
                </Button>
              </SignedIn>
              <Button
                asChild
                variant="outline"
                className="border-white/10 bg-black/20 text-white hover:bg-white/5 hover:text-white"
              >
                <a href="#features">Explore Features</a>
              </Button>
            </div>
          </div>

          {/* Right: Polaroid-style visual stack */}
          <div className="relative mx-auto h-[460px] w-full max-w-[520px]">
            <div className="absolute left-4 top-14 h-[340px] w-[250px] rounded-2xl border border-white/10 bg-[#121212] shadow-[0_20px_80px_rgba(0,0,0,0.45)] rotate-[-8deg]" />
            <div className="absolute right-8 top-20 h-[340px] w-[250px] rounded-2xl border border-white/10 bg-[#101010] shadow-[0_20px_80px_rgba(0,0,0,0.45)] rotate-[7deg]" />

            <div className="absolute left-1/2 top-6 w-[300px] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#161616] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
                  alt="Scenic travel preview"
                  className="h-[330px] w-full object-cover"
                />
              </div>
              <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-sm font-semibold text-white">Kyoto - Evening Walk</p>
                <p className="mt-1 text-xs text-[#9A9C9B]">Pinned to map, tagged by AI, ready to share.</p>
              </div>
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
