import { describe, it, expect, vi, beforeEach } from "vitest"
import L from "leaflet"
import { createPhotoMarker } from "./PhotoMapPin"
import type { Photo } from "@/app/types"

// Mock leaflet — vi.mock is hoisted, so this runs before any import resolution.
// L.marker() returns a fake marker object whose bindPopup is a spy.
vi.mock("leaflet", () => ({
  default: {
    marker: vi.fn((_latlng: unknown, _opts: unknown) => ({
      bindPopup: vi.fn().mockReturnThis(),
    })),
    divIcon: vi.fn((opts: object) => opts),
    point: vi.fn((x: number, y: number) => [x, y]),
  },
}))

// Mock mapUtils so createPhotoPin doesn't need a real Leaflet DivIcon
vi.mock("./mapUtils", () => ({
  createPhotoPin: vi.fn(() => ({ _mock: "icon" })),
}))


// Helper: get the marker instance produced by the last createPhotoMarker call
function lastMarker() {
  const calls = vi.mocked(L.marker).mock.results
  return calls[calls.length - 1].value as { bindPopup: ReturnType<typeof vi.fn> }
}

// Helper: get the popup HTML string from the last marker's bindPopup call
function lastPopupHtml(): string {
  return lastMarker().bindPopup.mock.calls[0][0] as string
}

const basePhoto: Photo = {
  id: "p1",
  tripId: "trip-abc",
  latitude: 51.5074,
  longitude: -0.1278,
  url: "https://cdn.example.com/photo.jpg",
  takenAt: "2024-06-15T10:00:00Z",
}

describe("createPhotoMarker", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Marker placement ──────────────────────────────────────────────────────

  it("places the marker at [latitude, longitude]", () => {
    createPhotoMarker(basePhoto)
    expect(vi.mocked(L.marker)).toHaveBeenCalledWith(
      [51.5074, -0.1278],
      expect.anything()
    )
  })

  // ── Popup is bound ────────────────────────────────────────────────────────

  it("binds a popup to the marker", () => {
    createPhotoMarker(basePhoto)
    expect(lastMarker().bindPopup).toHaveBeenCalledOnce()
  })

  it("uses the footprint-popup CSS class on the popup", () => {
    createPhotoMarker(basePhoto)
    const opts = lastMarker().bindPopup.mock.calls[0][1] as { className?: string }
    expect(opts?.className).toBe("footprint-popup")
  })

  // ── Popup HTML content ────────────────────────────────────────────────────

  it("includes the photo url as an image thumbnail", () => {
    createPhotoMarker(basePhoto)
    expect(lastPopupHtml()).toContain("https://cdn.example.com/photo.jpg")
  })

  it("includes a formatted date when takenAt is set", () => {
    createPhotoMarker(basePhoto) // takenAt = 2024-06-15
    expect(lastPopupHtml()).toContain("Jun 15, 2024")
  })

  it("omits the date row when takenAt is null", () => {
    createPhotoMarker({ ...basePhoto, takenAt: null })
    expect(lastPopupHtml()).not.toContain("Jun")
  })

  it("includes a 'View Trip →' link pointing to the trip", () => {
    createPhotoMarker(basePhoto)
    const html = lastPopupHtml()
    expect(html).toContain("/trips/trip-abc")
    expect(html).toContain("View Trip")
  })

  it("includes the optional tripName when provided", () => {
    createPhotoMarker(basePhoto, "Tokyo Adventure")
    expect(lastPopupHtml()).toContain("Tokyo Adventure")
  })

  it("does not include 'undefined' in popup html when tripName is omitted", () => {
    createPhotoMarker(basePhoto)
    expect(lastPopupHtml()).not.toContain("undefined")
  })

  it("omits the image tag when no URL is available", () => {
    createPhotoMarker({ ...basePhoto, url: undefined })
    expect(lastPopupHtml()).not.toContain("<img")
  })
})
