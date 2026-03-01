import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Trip, DayGroup } from "@/app/types"
import api from "@/lib/api"

export const fetchPhotosGrouped = createAsyncThunk<
    { tripId: string; groups: DayGroup[] },
    string,
    { rejectValue: string }
>("trips/fetchPhotosGrouped", async (tripId, { rejectWithValue }) => {
    try {
        const response = await api.get<DayGroup[]>(`/trips/${tripId}/photos/grouped`);
        return { tripId, groups: response.data };
    } catch (err: any) {
        const message =
            err?.response?.data?.message ?? err?.message ?? "Failed to load photos by day";
        return rejectWithValue(message);
    }
});

export const tripSlice = createSlice({
    name: "trip",
    initialState: {
        trips: [] as Trip[],
        loading: false,
        error: null as string | null,
        groupedPhotosByTripId: {} as Record<string, DayGroup[]>,
        groupedPhotosLoadingTripId: null as string | null,
        groupedPhotosError: null as string | null,
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
    // extraReducers is used to handle the async actions
    // Builder = “Whenever those actions happen, here’s how the slice should update its state.”
    extraReducers: (builder) => {
        builder.addCase(fetchPhotosGrouped.pending, (state, action) => {
            state.groupedPhotosLoadingTripId = action.meta.arg;
            state.groupedPhotosError = null;
        });
        builder.addCase(fetchPhotosGrouped.fulfilled, (state, action) => {
            state.groupedPhotosLoadingTripId = null;
            state.groupedPhotosByTripId[action.payload.tripId] = action.payload.groups;
        });
        builder.addCase(fetchPhotosGrouped.rejected, (state, action) => {
            state.groupedPhotosLoadingTripId = null;
            state.groupedPhotosError =
                (action.payload as string) ?? action.error.message ?? "Failed to load photos by day";
        });
    },
})

export const { addTrip, removeTrip, updateTrip } = tripSlice.actions;
export default tripSlice;



