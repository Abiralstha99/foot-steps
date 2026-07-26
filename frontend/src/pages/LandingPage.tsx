import type { ComponentType, MouseEvent } from "react"
import { motion } from "framer-motion"
import {
  Plane,
  MapPin,
  ArrowRight,
  Sparkles,
  CalendarClock,
  type LucideProps,
} from "lucide-react"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

type LucideIcon = ComponentType<LucideProps>

function scrollToFeatures(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  document
    .getElementById("features")
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}

function LandingNav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Plane className="size-5 text-forest" />
          <span className="font-display text-base font-bold tracking-tight text-slate-900">
            Footprint
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Log In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="forest">Start Free</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button variant="forest" asChild>
              <Link to="/home">Go to Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

function HeroPrimaryCta() {
  return (
    <>
      <SignedOut>
        <SignUpButton mode="modal">
          <Button variant="forest" size="lg" className="gap-2">
            Start Free
            <ArrowRight className="size-4" />
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Button variant="forest" size="lg" asChild className="gap-2">
          <Link to="/home">
            Go to Dashboard
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </SignedIn>
    </>
  )
}

function HeroSection() {
  return (
    <section className="min-h-[88vh] bg-white pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-forest-subtle px-3 py-1 text-xs font-semibold text-forest-muted">
            <MapPin className="size-3" />
            Travel Photo Journal
          </span>

          <h1 className="font-display text-[2.75rem] font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
            Your journey, <span className="text-forest">mapped</span> and{" "}
            remembered.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
            Upload your trip photos and Footprint automatically organizes them
            into an interactive map, a day-by-day timeline, and an AI-tagged
            album — ready to relive and share.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <HeroPrimaryCta />
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-500/40"
            >
              <a href="#features" onClick={scrollToFeatures}>
                See Features
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/80">
            <div className="flex h-9 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
              <span className="mx-auto rounded-full bg-slate-200 px-16 py-0.5 text-[10px] text-slate-500">
                footprint.app/trips
              </span>
            </div>

            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80"
                alt="Scenic travel landscape"
                className="h-[260px] w-full object-cover"
              />
              {/* Decorative pins — static demo, not live GPS data */}
              <div className="absolute left-[38%] top-[45%] flex size-7 items-center justify-center rounded-full bg-forest shadow-md">
                <MapPin className="size-3.5 text-white" fill="white" />
              </div>
              <div className="absolute left-[60%] top-[30%] flex size-6 items-center justify-center rounded-full bg-forest/80 shadow-md">
                <MapPin className="size-3 text-white" fill="white" />
              </div>
            </div>

            <div className="border-t border-slate-100 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">
                Kyoto — Evening Walk
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Pinned to map · AI-tagged · Ready to share
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="absolute -right-4 top-24 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-lg"
          >
            <p className="text-[11px] font-semibold text-slate-500">
              AI detected
            </p>
            <div className="mt-1 flex gap-1.5">
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                Fushimi Inari
              </span>
              <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-medium text-teal-700">
                Golden Hour
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const FEATURES: {
  icon: LucideIcon
  title: string
  body: string
}[] = [
  {
    icon: MapPin,
    title: "Automatic Mapping",
    body: "Photos with GPS data appear as pins on an interactive map — browse your trip by place, not just time.",
  },
  {
    icon: Sparkles,
    title: "AI Landmark Tagging",
    body: "Footprint recognizes landmarks, scenes, and objects automatically, adding context to every photo.",
  },
  {
    icon: CalendarClock,
    title: "Day-by-Day Timeline",
    body: "Photos are grouped by day and ordered chronologically, so your story flows from start to finish.",
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-16 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-forest">
            Built for storytelling
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything your trip deserves.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3 text-forest">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {feature.body}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="bg-green-800 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Turn your next trip into a story worth keeping.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-green-100">
          Free to start. Upload your first trip and see your photos become a
          map, a timeline, and a shareable album — in minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <SignedOut>
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="gap-2 bg-white text-green-900 shadow-md hover:bg-green-50 focus-visible:ring-green-700/40"
              >
                Start Free
                <ArrowRight className="size-4" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button
              size="lg"
              asChild
              className="gap-2 bg-white text-green-900 shadow-md hover:bg-green-50 focus-visible:ring-green-700/40"
            >
              <Link to="/home">
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </SignedIn>
        </div>
      </motion.div>
    </section>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
    </div>
  )
}
