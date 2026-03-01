import L from "leaflet"
import { format } from "date-fns"

import type { Photo } from "@/app/types"
import { createPhotoPin } from "./mapUtils"

/**
 * Creates a fully configured Leaflet Marker for a geotagged photo.
 * Includes a custom DivIcon thumbnail pin and a styled popup.
 *
 * Caller is responsible for ensuring photo.latitude / photo.longitude are non-null.
 */
export function createPhotoMarker(photo: Photo, tripName?: string): L.Marker {
  const icon = createPhotoPin(photo)
  const marker = L.marker([photo.latitude!, photo.longitude!], { icon })

  const src = photo.url ?? ""

  let dateLabel: string | null = null
  if (photo.takenAt) {
    try {
      dateLabel = format(new Date(photo.takenAt), "MMM d, yyyy")
    } catch {
      dateLabel = null
    }
  }

  const thumbnailHtml = src
    ? `<img src="${src}" crossorigin="anonymous" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:4px;display:block;margin-bottom:8px;" />`
    : ""

  const tripNameHtml = tripName
    ? `<p style="margin:0 0 2px;font-size:13px;font-weight:500;color:var(--text-primary);">${tripName}</p>`
    : ""

  const dateHtml = dateLabel
    ? `<p style="margin:0 0 6px;font-size:12px;color:var(--text-secondary);">${dateLabel}</p>`
    : ""

  const linkHtml = photo.tripId
    ? `<a href="/trips/${photo.tripId}" style="font-size:12px;color:var(--accent);text-decoration:none;font-weight:500;">View Trip →</a>`
    : ""

  const popupHtml = `
    <div style="min-width:100px;padding:4px;">
      ${thumbnailHtml}
      ${tripNameHtml}
      ${dateHtml}
      ${linkHtml}
    </div>
  `

  marker.bindPopup(popupHtml, { maxWidth: 220, className: "footprint-popup" })

  return marker
}
