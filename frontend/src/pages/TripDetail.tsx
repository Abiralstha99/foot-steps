import { useParams } from "react-router-dom"

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6 pt-4">
      <h1 className="text-2xl font-semibold text-white">Trip</h1>
      <p className="text-[#9A9C9B]">Trip ID: {id}</p>
    </div>
  )
}