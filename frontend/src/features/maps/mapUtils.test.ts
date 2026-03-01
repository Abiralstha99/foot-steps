import { describe, it, expect, vi, afterEach } from "vitest"

// Mock leaflet before importing mapUtils so L.divIcon / L.point are intercepted.
// vi.mock is hoisted by Vitest — the factory runs before module resolution.
vi.mock("leaflet", () => ({
  default: {
    // Return the options object directly so tests can inspect .html, .className, etc.
    divIcon: vi.fn((opts: object) => opts),
    point: vi.fn((x: number, y: number) => [x, y]),
  },
}))

import {
  getLightTileUrl,
  getDarkTileUrl,
  getCurrentTileUrl,
  createPhotoPin,
  getClusterIconFactory,
} from "./mapUtils"
import type { Photo } from "@/app/types"

const LIGHT_URL = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
const DARK_URL = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"

describe("mapUtils", () => {
  // ── Tile URL helpers ─────────────────────────────────────────────────────

  describe("getLightTileUrl", () => {
    it("returns the Stadia Alidade Smooth light tile URL", () => {
      expect(getLightTileUrl()).toBe(LIGHT_URL)
    })
  })

  describe("getDarkTileUrl", () => {
    it("returns the Stadia Alidade Smooth dark tile URL", () => {
      expect(getDarkTileUrl()).toBe(DARK_URL)
    })
  })

  describe("getCurrentTileUrl", () => {
    afterEach(() => {
      document.documentElement.classList.remove("light")
    })

    it("returns the dark URL when <html> has no 'light' class (dark is default)", () => {
      expect(getCurrentTileUrl()).toBe(DARK_URL)
    })

    it("returns the light URL when <html> has the 'light' class", () => {
      document.documentElement.classList.add("light")
      expect(getCurrentTileUrl()).toBe(LIGHT_URL)
    })

    it("switches back to dark URL after removing the 'light' class", () => {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("light")
      expect(getCurrentTileUrl()).toBe(DARK_URL)
    })
  })

  // ── createPhotoPin ───────────────────────────────────────────────────────

  describe("createPhotoPin", () => {
    const base: Photo = { id: "p1", tripId: "t1", latitude: 10, longitude: 20 }

    it("produces a DivIcon with an <img> tag when photo has url", () => {
      const photo = { ...base, url: "https://cdn.example.com/img.jpg" }
      const icon = createPhotoPin(photo) as any
      expect(icon.html).toContain("<img")
      expect(icon.html).toContain("https://cdn.example.com/img.jpg")
    })

    it("renders a placeholder <div> when no URL is available", () => {
      const icon = createPhotoPin(base) as any
      expect(icon.html).toContain("<div")
      expect(icon.html).not.toContain("<img")
    })

    it("applies accent border styling", () => {
      const photo = { ...base, url: "https://cdn.example.com/img.jpg" }
      const icon = createPhotoPin(photo) as any
      expect(icon.html).toContain("var(--accent)")
    })

    it("sets iconSize to 32×32 and iconAnchor to bottom-center [16, 32]", () => {
      const icon = createPhotoPin(base) as any
      expect(icon.iconSize).toEqual([32, 32])
      expect(icon.iconAnchor).toEqual([16, 32])
    })
  })

  // ── getClusterIconFactory ────────────────────────────────────────────────

  describe("getClusterIconFactory", () => {
    it("returns a function", () => {
      expect(typeof getClusterIconFactory()).toBe("function")
    })

    it("returned factory embeds the cluster child count in the html", () => {
      const factory = getClusterIconFactory()
      const cluster = { getChildCount: () => 7 }
      const icon = factory(cluster) as any
      expect(icon.html).toContain("7")
    })

    it("applies accent background to the cluster bubble", () => {
      const factory = getClusterIconFactory()
      const icon = factory({ getChildCount: () => 3 }) as any
      expect(icon.html).toContain("var(--accent)")
    })

    it("produces different counts for different clusters", () => {
      const factory = getClusterIconFactory()
      const icon12 = factory({ getChildCount: () => 12 }) as any
      const icon99 = factory({ getChildCount: () => 99 }) as any
      expect(icon12.html).toContain("12")
      expect(icon99.html).toContain("99")
    })

    it("sets iconSize to 36×36 and iconAnchor to center [18, 18]", () => {
      const factory = getClusterIconFactory()
      const icon = factory({ getChildCount: () => 1 }) as any
      expect(icon.iconSize).toEqual([36, 36])
      expect(icon.iconAnchor).toEqual([18, 18])
    })
  })
})
