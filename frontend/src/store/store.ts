import { configureStore } from "@reduxjs/toolkit";
import tripSlice from "./slice/tripSlice";

export const store = configureStore({
  reducer: {
    trip: tripSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
