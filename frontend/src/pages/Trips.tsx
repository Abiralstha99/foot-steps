import { useState } from "react"
import { CreateTripModal } from "@/components/trips/CreateTripForm"
import { Button } from "@/components/ui/button"

export function TripsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Trips</h1>
          <p className="text-[#9A9C9B]">Your trips will appear here.</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-app-accent text-white hover:bg-app-accent-hover"
        >
          Create trip
        </Button>

        <CreateTripModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      </div>
    </div>
  )
}
