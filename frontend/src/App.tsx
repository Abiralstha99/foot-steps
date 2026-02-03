import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <MainLayout>
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B5D5C]">
            Travel Photo Journal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Rediscover every journey in{" "}
            <span className="bg-gradient-to-r from-[#EDEDED] via-[#C8D0CB] to-[#3C4741] bg-clip-text text-transparent">
              cinematic detail
            </span>
            .
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#9A9C9B] sm:text-base">
            Curate your favorite travel moments, pin them to a map, and build a
            living archive of the stories behind every photo you capture on the
            road.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-[#3C4741] text-white hover:bg-[#4B5A52]">
            Start a new trip
          </Button>
          <Button
            variant="outline"
            className="border-[#2A2A2A] bg-transparent text-[#EDEDED] hover:bg-[#1A1A1A]"
          >
            Browse past journeys
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
