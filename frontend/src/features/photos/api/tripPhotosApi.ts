import { createApi } from "@reduxjs/toolkit/query/react";
import type { DayGroup, Photo } from "@/app/types";
import { axiosBaseQuery } from "../../../lib/axiosBaseQuery";

export const tripPhotosApi = createApi({
  reducerPath: "tripPhotosApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Photos"],
  endpoints: (build) => ({
    getPhotosGrouped: build.query<DayGroup[], string>({
      query: (tripId) => ({ url: `/trips/${tripId}/photos/grouped` }),
      providesTags: (_, __, tripId) => [{ type: "Photos" as const, id: tripId }],
    }),

    getPhotos: build.query<Photo[], string>({
      query: (tripId) => ({ url: `/trips/${tripId}/photos` }),
      providesTags: (result, _, tripId) =>
        result
          ? [
            { type: "Photos" as const, id: tripId },
            ...result.map((p) => ({
              type: "Photos" as const,
              id: `${tripId}-${p.id}`,
            })),
          ]
          : [{ type: "Photos", id: tripId }],
    }),

    uploadPhoto: build.mutation<Photo, { tripId: string; file: File }>({
      query: ({ tripId, file }) => {
        const formData = new FormData();
        formData.append("photo", file);
        return {
          url: `/trips/${tripId}/photos`,
          method: "POST",
          data: formData,
        };
      },
      invalidatesTags: (_result, _err, { tripId }) => [
        { type: "Photos", id: tripId },
      ],
    }),

    deletePhoto: build.mutation<void, { photoId: string; tripId: string }>({
      query: ({ photoId }) => ({ url: `/photos/${photoId}`, method: "DELETE" }),
      invalidatesTags: (_result, _err, { tripId }) => [
        { type: "Photos", id: tripId },
      ],
    }),

    updateCaption: build.mutation<
      Photo,
      { photoId: string; caption: string; tripId: string }
    >({
      query: ({ photoId, caption }) => ({
        url: `/photos/${photoId}`,
        method: "PATCH",
        data: { caption },
      }),
      invalidatesTags: (_result, _err, { tripId }) => [
        { type: "Photos", id: tripId },
      ],
    }),
  }),
});

export const {
  useGetPhotosGroupedQuery,
  useGetPhotosQuery,
  useUploadPhotoMutation,
  useDeletePhotoMutation,
  useUpdateCaptionMutation,
} = tripPhotosApi;
