import { configureStore } from "@reduxjs/toolkit";
import tripSlice from "../features/trips/tripsSlice";

export const store = configureStore({
  reducer: {
    trip: tripSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
