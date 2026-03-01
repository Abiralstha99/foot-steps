
export interface Photo {
  id: string;
  tripId: string;
  url?: string | null;
  // Fresh, short-lived signed URL returned by the API for viewing.
  // Prefer this over `url` when present.
  viewUrl?: string | null;
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

