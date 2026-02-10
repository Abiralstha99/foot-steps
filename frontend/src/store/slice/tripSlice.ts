import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Trip } from "../types/trip"

export const tripSlice = createSlice({
    name: "trip",
    initialState: {
        trips: [] as Trip[],
    },
    reducers: {
        addTrips: (state, action: PayloadAction<Trip>) => {
            const trip = action.payload;
            state.trips.push(trip);
        },

        removeTrip: (state, action: PayloadAction<string>) => {
            const tripId = action.payload;
            state.trips = state.trips.filter((trip) => trip.id !== tripId);
        },
    },
})

export const { addTrips, removeTrip } = tripSlice.actions;
export default tripSlice;