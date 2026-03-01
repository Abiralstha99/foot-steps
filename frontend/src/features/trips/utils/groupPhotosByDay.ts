import type { DayGroup, Photo } from "@/app/types"

/**
 * Groups photos by calendar day (YYYY-MM-DD from takenAt), sorted ascending.
 * Photos with no takenAt are appended as a final "Unknown Date" group.
 * Used for the share album page where the grouped API is not available.
 */
export function groupPhotosByDay(photos: Photo[]): DayGroup[] {
  const dated = photos.filter((p) => p.takenAt != null)
  const undated = photos.filter((p) => p.takenAt == null)

  dated.sort((a, b) => {
    return new Date(a.takenAt!).getTime() - new Date(b.takenAt!).getTime()
  })

  const grouped = new Map<string, Photo[]>()
  for (const photo of dated) {
    const key = (photo.takenAt as string).slice(0, 10)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(photo)
  }

  const result: DayGroup[] = Array.from(grouped.entries()).map(([label, groupedPhotos]) => ({
    label,
    photos: groupedPhotos,
  }))

  if (undated.length > 0) {
    result.push({ label: "Unknown Date", photos: undated })
  }

  return result
}
