export interface Trip {
  id: string
  userId: string
  name: string
  description?: string | null
  startDate: string
  endDate: string
  coverPhotoUrl?: string | null
  createdAt?: string
}
