import { CreateTripModal } from "@/components/trips/CreateTripModal"
export function TripsPage() {
  return (
    <div className="space-y-6 pt-4">
      <h1 className="text-2xl font-semibold text-white">My Trips</h1>
      <p className="text-[#9A9C9B]">Your trips will appear here.</p>
      <CreateTripModal />
    </div>
  )
}
