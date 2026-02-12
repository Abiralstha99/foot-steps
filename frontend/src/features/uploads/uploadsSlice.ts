import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UploadsState } from "@/app/types";

export const uploadsSlice = createSlice({
    name: "uploads",
    initialState: {
        byId: {} as UploadsState["byId"]
    },
    reducers: {
        startUpload: (state, action: PayloadAction<{ id: string; url: string }>) => {
            const { id, url } = action.payload;
            state.byId[id] = {
                progress: 0,
                status: "idle",
                url: url
            };
        },

        setUploadProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
            const { id, progress } = action.payload;
            state.byId[id].progress = progress;
        },

        setUploadStatus: (state, action: PayloadAction<{ id: string; status: "idle" | "uploading" | "done" | "error" }>) => {
            const { id, status } = action.payload;
            state.byId[id].status = status;
        },

        setUploadError: (state, action: PayloadAction<{ id: string; error: string }>) => {
            const { id, error } = action.payload;
            state.byId[id].error = error;
        },

        setUploadUrl: (state, action: PayloadAction<{ id: string; url: string }>) => {
            const { id, url } = action.payload;
            state.byId[id].url = url;
        },

        clearUpload: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            delete state.byId[id];
        },  
    }
})

export const { startUpload, setUploadProgress, setUploadStatus, setUploadError, setUploadUrl, clearUpload } = uploadsSlice.actions;
export default uploadsSlice;