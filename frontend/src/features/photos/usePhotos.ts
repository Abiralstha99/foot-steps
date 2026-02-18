import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { updatePhotoCaptionThunk } from "./photosSlice"

interface UseUpdatePhotoReturn {
  updatePhotoCaption: (photoId: string, caption: string) => Promise<void>
  loading: boolean
  error: string | null
}

export function useUpdatePhoto(): UseUpdatePhotoReturn {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.photos.loading)
  const error = useAppSelector((state) => state.photos.error)

  const updatePhotoCaption = async (photoId: string, caption: string) => {
    await dispatch(updatePhotoCaptionThunk({ id: photoId, caption })).unwrap()
  }

  return {
    updatePhotoCaption,
    loading,
    error,
  }
}
