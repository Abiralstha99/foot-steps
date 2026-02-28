export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  location?: string | null;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string | null;
  // Fresh signed URL for viewing the cover (when coverPhotoUrl stores an S3 key).
  coverViewUrl?: string | null;
  createdAt?: string;
  _count?: { photos: number };
}

export type CreateTripInput = {
  userId: string;
  name: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string;
};

export type UpdateTripInput = {
  name?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  coverPhotoUrl?: string;
};

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

export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
}

export interface UploadEntry {
  progress: number;
  status: "idle" | "uploading" | "done" | "error";
  error?: string | null;
  url?: string | null;
}

export type UploadsState = {
  byId: Record<string, UploadEntry>;
  all: string[];
};

export type UploadOptions = {
  endpoint: string;
  file: File;
  fieldName?: string;
  headers?: Record<string, string>;
  extraFormData?: Record<string, string>;
  uploadId?: string;
};

export type UploadResult = {
  uploadId: string;
  url: string;
};
