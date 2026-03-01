export interface Photo {
  id: string;
  tripId: string;
  /** Display-ready signed URL. Never an S3 key. */
  url?: string | null;
  takenAt?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  aiTags?: string[] | null;
  caption?: string | null;
  createdAt?: string;
}

export type DayGroup = {
  label: string // "YYYY-MM-DD" for dated photos, "Unknown Date" for undated
  photos: Photo[]
}

