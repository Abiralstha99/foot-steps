import { configureStore } from "@reduxjs/toolkit"
import tripSlice from "../features/trips/tripsSlice"
import uploadsSlice from "../features/uploads/uploadsSlice"
import photosSlice from "../features/photos/photosSlice"
import { tripPhotosApi } from "../features/photos/api/tripPhotosApi"
import { tripsApi } from "../features/trips/tripsApi"

export const store = configureStore({
  reducer: {
    trip: tripSlice.reducer,
    uploads: uploadsSlice.reducer,
    photos: photosSlice.reducer,
    [tripPhotosApi.reducerPath]: tripPhotosApi.reducer,
    [tripsApi.reducerPath]: tripsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tripPhotosApi.middleware, tripsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

