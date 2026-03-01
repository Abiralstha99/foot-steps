import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Trip } from "@/app/types"

export const tripSlice = createSlice({
    name: "trip",
    initialState: {
        trips: [] as Trip[],
        loading: false,
        error: null as string | null,
    },
    reducers: {
        addTrip: (state, action: PayloadAction<Trip>) => {
            const trip = action.payload;
            state.trips.push(trip);
        },

        removeTrip: (state, action: PayloadAction<string>) => {
            const tripId = action.payload;
            state.trips = state.trips.filter((trip) => trip.id !== tripId);
        },

        updateTrip: (state, action: PayloadAction<{ id: string; changes: Partial<Trip> }>) => {
            const { id, changes } = action.payload;
        
            const trip = state.trips.find(t => t.id === id);
            if (trip) {
                Object.assign(trip, changes);
            }
        },
    },
})

export const { addTrip, removeTrip, updateTrip } = tripSlice.actions;
export default tripSlice;



