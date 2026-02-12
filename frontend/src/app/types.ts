export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string | null;
  createdAt?: string;
}

export type CreateTripInput = {
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhotoUrl?: string;
};

export interface Photo {
  id: string;
  tripId: string;
  url: string;
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
