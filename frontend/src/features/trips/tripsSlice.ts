import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CreateTripInput, UpdateTripInput, Trip } from "@/app/types"
import api from "@/lib/api"

// Thunks - a special kind of function used fo async operations
// Thunk = “I’m going to fetch data and automatically send pending/fulfilled/rejected actions.”
export const fetchTrips = createAsyncThunk("trips/fetchTrips", async () => {
    const response = await api.get("/trips");
    return response.data;
});

export const createTrip = createAsyncThunk<Trip, CreateTripInput, { rejectValue: string }>(
    "trips/createTrip",
    async (trip, { rejectWithValue }) => {
        try {
            const response = await api.post("/trips", trip);
            return response.data as Trip;
        } catch (err: any) {
            const message = err?.response?.data?.message ?? err?.message ?? "Failed to create trip";
            return rejectWithValue(message);
        }
    }
);
export const updateTripAsync = createAsyncThunk<Trip, { id: string; changes: UpdateTripInput }, { rejectValue: string }>(
    "trips/updateTripAsync",
    async ({ id, changes }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/trips/${id}`, changes);
            return response.data as Trip;
        } catch (err: any) {
            const message = err?.response?.data?.message ?? err?.message ?? "Failed to update trip";
            return rejectWithValue(message);
        }
    }
);

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
    // extraReducers is used to handle the async actions
    // Builder = “Whenever those actions happen, here’s how the slice should update its state.”
    extraReducers: (builder) => {
        builder.addCase(fetchTrips.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTrips.fulfilled, (state, action) => {
            state.loading = false;
            state.trips = action.payload as Trip[];
        });
        builder.addCase(fetchTrips.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message as string;
        });
        builder.addCase(createTrip.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createTrip.fulfilled, (state, action) => {
            state.loading = false;
            state.trips.push(action.payload);
        });
        builder.addCase(createTrip.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) ?? action.error.message ?? "Failed to create trip";
        });
        builder.addCase(updateTripAsync.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateTripAsync.fulfilled, (state, action) => {
            state.loading = false;
            const idx = state.trips.findIndex(t => t.id === action.payload.id);
            if (idx !== -1) {
                state.trips[idx] = action.payload;
            }
        });
        builder.addCase(updateTripAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string) ?? action.error.message ?? "Failed to update trip";
        });
    },
})

export const { addTrip, removeTrip, updateTrip } = tripSlice.actions;
export default tripSlice;
