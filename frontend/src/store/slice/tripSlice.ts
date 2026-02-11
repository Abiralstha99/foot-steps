import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Trip } from "../types/trip"

interface TripsState {
    tripsList: Trip[];
  }
  
  const initialState: TripsState = {
    tripsList: []
  };
export const tripSlice = createSlice({
    name: "trip",
    initialState,
    reducers: {
        addTrips: (state, action: PayloadAction<Trip>) => {
            state.tripsList.push(action.payload);
        },

        removeTrip: (state, action: PayloadAction<string>) => {
            const tripId = action.payload;
            state.tripsList = state.tripsList.filter((tripsList) => tripsList.id !== tripId);
        },
    },
})

export const { addTrips, removeTrip } = tripSlice.actions;
export default tripSlice;