import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import type { UploadOptions, UploadResult } from "@/app/types"
import type { RootState } from "@/app/store"
import { startUpload, setUploadProgress, setUploadStatus, setUploadError, setUploadUrl } from "./uploadsSlice"
import api from "@/lib/api"

export const selectUploadsById = (state: RootState) => state.uploads.byId
export const selectUploadById = (uploadId: string) => (state: RootState) =>
  state.uploads.byId[uploadId] ?? null

export const useUpload = () => {
  const dispatch = useAppDispatch()

  const uploadFile = useCallback(
    async ({
      endpoint,
      file,
      fieldName = "photo",
      headers,
      extraFormData,
      uploadId: providedUploadId,
    }: UploadOptions): Promise<UploadResult> => {
      const uploadId = providedUploadId ?? `upload-${Date.now()}`

      dispatch(startUpload({ id: uploadId, url: "" }))
      dispatch(setUploadStatus({ id: uploadId, status: "uploading" }))

      try {
        const formData = new FormData()
        formData.append(fieldName, file)
        if (extraFormData) {
          for (const [key, value] of Object.entries(extraFormData)) {
            formData.append(key, value)
          }
        }

        const response = await api.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data", ...(headers ?? {}) },
          // 'e' is a ProgressEvent object provided by Axios, which represents the current state of the upload.
          onUploadProgress: (e) => {
            const progress = e.total ? Math.round((e.loaded / e.total) * 100) : 0
            dispatch(setUploadProgress({ id: uploadId, progress }))
          },
        })

        const url = response.data?.url
        if (!url) {
          throw new Error("No URL in response")
        }
        dispatch(setUploadUrl({ id: uploadId, url }))
        dispatch(setUploadStatus({ id: uploadId, status: "done" }))

        return { uploadId, url }
      } catch (err: any) {
        dispatch(setUploadStatus({ id: uploadId, status: "error" }))
        dispatch(setUploadError({ id: uploadId, error: err.message ?? "Upload failed" }))
        throw err
      }
    },
    [dispatch]
  )

  return { uploadFile }
}

export const useUploadState = (uploadId: string | null) => {
  return useAppSelector((state) => (uploadId ? selectUploadById(uploadId)(state) : null))
}
