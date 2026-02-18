import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Photo } from "@/app/types"
import { updatePhotoCaption } from "@/features/photos/api/photosApi"
import api from "@/lib/api"

export const fetchAllPhotos = createAsyncThunk<Photo[]>(
    "photos/fetchAll",
    async () => {
      const response = await api.get<Photo[]>("/photos/all");
      return response.data;
    }
  );

export const updatePhotoCaptionThunk = createAsyncThunk<
  Photo,
  { id: string; caption: string },
  { rejectValue: { id: string; message: string } }
>("photos/updateCaption", async ({ id, caption }, { rejectWithValue }) => {
  try {
    return await updatePhotoCaption(id, caption)
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Failed to update caption"
    return rejectWithValue({ id, message })
  }
})

export const photosSlice = createSlice({
    name: "photos",
    initialState: {
        photos: [] as Photo[],
        loading: false,
        error: null as string | null,
        previousCaptions: {} as Record<string, string | null>,
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
        builder
            .addCase(fetchAllPhotos.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllPhotos.fulfilled, (state, action) => {
                state.loading = false
                state.photos = action.payload
                state.error = null
            })
            .addCase(fetchAllPhotos.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? "Failed to fetch photos"
            })
        builder.addCase(updatePhotoCaptionThunk.pending, (state, action) => {
            state.loading = true
            state.error = null
            const { id, caption } = action.meta.arg
            const photo = state.photos.find((p) => p.id === id)
            if (photo) {
                state.previousCaptions[id] = photo.caption ?? null
                photo.caption = caption
            }
        })
        builder.addCase(updatePhotoCaptionThunk.rejected, (state, action) => {
            state.loading = false
            const payload = action.payload
            if (payload) {
                const photo = state.photos.find((p) => p.id === payload.id)
                if (photo) {
                    photo.caption = state.previousCaptions[payload.id] ?? null
                }
                delete state.previousCaptions[payload.id]
                state.error = payload.message
            } else {
                state.error = action.error.message ?? "Failed to update caption"
            }
        })
        builder.addCase(updatePhotoCaptionThunk.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            const updated = action.payload
            const idx = state.photos.findIndex((p) => p.id === updated.id)
            if (idx !== -1) {
                state.photos[idx] = updated
            } else {
                state.photos.push(updated)
            }
            delete state.previousCaptions[updated.id]
        })
    }
})

export const { addPhoto, removePhoto, updatePhoto } = photosSlice.actions;
export default photosSlice;
