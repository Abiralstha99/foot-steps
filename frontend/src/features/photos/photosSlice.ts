import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Photo } from "@/app/types"
import api from "@/lib/api" 
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchAllPhotos = createAsyncThunk(
    "photos/fetchAll", 
    async () => {
      const response = await api.get("/photos/all");
      return response.data;
    }
  );

export const photosSlice = createSlice({
    name: "photos",
    initialState: {
        photos: [] as Photo[],
        loading: false,
        error: null as string | null,
    },
    reducers: {
        addPhoto: (state, action: PayloadAction<Photo>) => {
            const photo = action.payload;
            state.photos.push(photo);
        },

        removePhoto: (state, action: PayloadAction<string>) => {
            const photoId = action.payload;
            state.photos = state.photos.filter((photo) => photo.id !== photoId);
        },

        updatePhoto: (state, action: PayloadAction<{ id: string; changes: Partial<Photo> }>) => {
            const { id, changes } = action.payload;
            const photo = state.photos.find(p => p.id === id);
            if (photo) {
                Object.assign(photo, changes);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllPhotos.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.photos = action.payload;
        });
    }
})



export const { addPhoto, removePhoto, updatePhoto } = photosSlice.actions;