import { createApi } from "@reduxjs/toolkit/query/react"
import type { Trip, CreateTripInput, UpdateTripInput } from "@/app/types"
import { axiosBaseQuery } from "@/lib/axiosBaseQuery"

export const tripsApi = createApi({
  reducerPath: "tripsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Trips"],
  endpoints: (build) => ({
    getTrips: build.query<Trip[], void>({
      query: () => ({ url: "/trips" }),
      providesTags: (result) =>
        result
          ? [
              { type: "Trips" as const, id: "LIST" },
              ...result.map((trip) => ({ type: "Trips" as const, id: trip.id })),
            ]
          : [{ type: "Trips", id: "LIST" }],
    }),

    getTrip: build.query<Trip, string>({
      query: (id) => ({ url: `/trips/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Trips", id }],
    }),

    createTrip: build.mutation<Trip, CreateTripInput>({
      query: (body) => ({
        url: "/trips",
        method: "POST",
        data: body,
      }),
      invalidatesTags: (_result, _error, _arg) => [{ type: "Trips", id: "LIST" }],
    }),

    updateTrip: build.mutation<Trip, { id: string; changes: UpdateTripInput }>({
      query: ({ id, changes }) => ({
        url: `/trips/${id}`,
        method: "PATCH",
        data: changes,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Trips", id },
        { type: "Trips", id: "LIST" },
      ],
    }),

    updateCoverPhoto: build.mutation<Trip, { id: string; coverPhotoId: string }>({
      query: ({ id, coverPhotoId }) => ({
        url: `/trips/${id}`,
        method: "PATCH",
        data: { coverPhotoId },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Trips", id }],
    }),

    removeCoverPhoto: build.mutation<Trip, { id: string }>({
      query: ({ id }) => ({
        url: `/trips/${id}`,
        method: "PATCH",
        data: { coverPhotoUrl: null },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Trips", id }],
    }),
  }),
})

export const {
  useGetTripsQuery,
  useGetTripQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useUpdateCoverPhotoMutation,
  useRemoveCoverPhotoMutation,
} = tripsApi

