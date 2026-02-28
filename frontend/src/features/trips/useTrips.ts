import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { fetchTrips, createTrip, updateTripAsync } from "./tripsSlice";
import type { CreateTripInput, UpdateTripInput, Trip } from "@/app/types";
import type { RootState } from "@/app/store";

export const selectTrips = (state: RootState) => state.trip.trips;
export const selectTripsLoading = (state: RootState) => state.trip.loading;
export const selectTripsError = (state: RootState) => state.trip.error;
export const selectTripById = (tripId: string) => (state: RootState) =>
  state.trip.trips.find((trip) => trip.id === tripId);

export const useCreateTrip = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectTripsLoading);
  const error = useAppSelector(selectTripsError);

  const createTripHandler = async (trip: CreateTripInput): Promise<Trip> => {
    return await dispatch(createTrip(trip)).unwrap();
  };

  return {
    createTrip: createTripHandler,
    loading,
    error,
  };
};

export const useUpdateTrip = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectTripsLoading);
  const error = useAppSelector(selectTripsError);

  const updateTripHandler = async (id: string, changes: UpdateTripInput): Promise<Trip> => {
    return await dispatch(updateTripAsync({ id, changes })).unwrap();
  };

  return {
    updateTrip: updateTripHandler,
    loading,
    error,
  };
};

export const useFetchTrips = () => {
  const dispatch = useAppDispatch();
  return {
    fetchTrips: () => dispatch(fetchTrips() as any),
  };
};

export const useTrips = () => {
  const trips = useAppSelector(selectTrips);
  const loading = useAppSelector(selectTripsLoading);
  const error = useAppSelector(selectTripsError);

  return { trips, loading, error };
};
