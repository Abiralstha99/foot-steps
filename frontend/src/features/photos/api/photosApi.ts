import api from "@/lib/api"
import type { Photo } from "@/app/types"

export async function updatePhotoCaption(photoId: string, caption: string) {
  const res = await api.patch<Photo>(`/photos/${photoId}`, { caption })
  return res.data
}

