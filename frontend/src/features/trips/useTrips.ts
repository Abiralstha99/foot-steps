import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { fetchTrips, createTrip, updateTripAsync, fetchPhotosGrouped } from "./tripsSlice";
import type { CreateTripInput, UpdateTripInput, Trip } from "@/app/types";
import type { RootState } from "@/app/store";

export const selectTrips = (state: RootState) => state.trip.trips;
export const selectTripsLoading = (state: RootState) => state.trip.loading;
export const selectTripsError = (state: RootState) => state.trip.error;
export const selectTripById = (tripId: string) => (state: RootState) =>
  state.trip.trips.find((trip) => trip.id === tripId);
export const selectGroupedPhotosByTripId = (tripId: string) => (state: RootState) =>
  state.trip.groupedPhotosByTripId[tripId] ?? [];
export const selectGroupedPhotosLoading = (state: RootState) =>
  state.trip.groupedPhotosLoadingTripId;
export const selectGroupedPhotosError = (state: RootState) => state.trip.groupedPhotosError;

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

export const usePhotosByGrouped = (tripId: string | undefined) => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(
    tripId ? selectGroupedPhotosByTripId(tripId) : () => []
  );
  const loading = useAppSelector(selectGroupedPhotosLoading);
  const error = useAppSelector(selectGroupedPhotosError);
  const isLoadingThisTrip = Boolean(tripId && loading === tripId);

  const refetch = () => {
    if (tripId) dispatch(fetchPhotosGrouped(tripId));
  };

  useEffect(() => {
    if (tripId) dispatch(fetchPhotosGrouped(tripId));
  }, [dispatch, tripId]);

  return {
    groups,
    loading: isLoadingThisTrip,
    error,
    refetch,
  };
};
