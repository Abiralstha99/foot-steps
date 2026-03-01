import type { CreateTripInput, UpdateTripInput, Trip } from "@/app/types"
import type { RootState } from "@/app/store"
import {
  useGetTripsQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
} from "./tripsApi"
import { useGetPhotosGroupedQuery } from "@/features/photos/api/tripPhotosApi"

export const selectTrips = (state: RootState) => state.trip.trips
export const selectTripsLoading = (state: RootState) => state.trip.loading
export const selectTripsError = (state: RootState) => state.trip.error
export const selectTripById = (tripId: string) => (state: RootState) =>
  state.trip.trips.find((trip) => trip.id === tripId)

export const useCreateTrip = () => {
  const [createTripMutation, { isLoading, error }] = useCreateTripMutation()

  const createTripHandler = async (trip: CreateTripInput): Promise<Trip> => {
    return await createTripMutation(trip).unwrap()
  }

  return {
    createTrip: createTripHandler,
    loading: isLoading,
    error: error ? "Failed to create trip" : null,
  }
}

export const useUpdateTrip = () => {
  const [updateTripMutation, { isLoading, error }] = useUpdateTripMutation()

  const updateTripHandler = async (id: string, changes: UpdateTripInput): Promise<Trip> => {
    return await updateTripMutation({ id, changes }).unwrap()
  }

  return {
    updateTrip: updateTripHandler,
    loading: isLoading,
    error: error ? "Failed to update trip" : null,
  }
}

export const useFetchTrips = () => {
  // Kept for backwards compatibility; callers should prefer useTrips()
  const { refetch } = useGetTripsQuery(undefined)
  return {
    fetchTrips: () => refetch(),
  }
}

export const useTrips = () => {
  const { data: trips = [], isLoading, error } = useGetTripsQuery(undefined)

  return {
    trips,
    loading: isLoading,
    error: error ? "Failed to load trips" : null,
  }
}

export const usePhotosByGrouped = (tripId: string | undefined) => {
  const { data: groups = [], isLoading, error, refetch } = useGetPhotosGroupedQuery(
    tripId!,
    { skip: !tripId },
  )
  return {
    groups,
    loading: isLoading,
    error: error ? "Failed to load timeline" : null,
    refetch,
  }
}

