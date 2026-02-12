import { configureStore } from "@reduxjs/toolkit";
import tripSlice from "../features/trips/tripsSlice";
import uploadsSlice from "../features/uploads/uploadsSlice";

export const store = configureStore({
  reducer: {
    trip: tripSlice.reducer,
    uploads: uploadsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
