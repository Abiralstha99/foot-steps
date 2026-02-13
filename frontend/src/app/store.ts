import { configureStore } from "@reduxjs/toolkit";
import tripSlice from "../features/trips/tripsSlice";
import uploadsSlice from "../features/uploads/uploadsSlice";
import photosSlice from "../features/photos/photosSlice";

export const store = configureStore({
  reducer: {
    trip: tripSlice.reducer,
    uploads: uploadsSlice.reducer,
    photos: photosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
