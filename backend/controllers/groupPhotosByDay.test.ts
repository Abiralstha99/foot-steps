import { describe, it, expect } from "vitest"
import { groupPhotosByDay } from "./tripsController"
import type { Photo } from "../types/types"

function photo(id: string, takenAt: string | null = null): Photo {
  return { id, tripId: "t1", takenAt }
}

describe("groupPhotosByDay", () => {
  it("returns an empty array for empty input", () => {
    expect(groupPhotosByDay([])).toEqual([])
  })

  it("groups photos sharing the same calendar day into one group", () => {
    const photos = [
      photo("1", "2024-06-15T08:00:00Z"),
      photo("2", "2024-06-15T16:30:00Z"),
      photo("3", "2024-06-16T10:00:00Z"),
    ]
    const groups = groupPhotosByDay(photos)
    expect(groups).toHaveLength(2)
    expect(groups[0].label).toBe("2024-06-15")
    expect(groups[0].photos.map((p) => p.id)).toEqual(["1", "2"])
    expect(groups[1].label).toBe("2024-06-16")
    expect(groups[1].photos.map((p) => p.id)).toEqual(["3"])
  })

  it("orders day groups ascending by date", () => {
    const photos = [
      photo("a", "2024-06-20T08:00:00Z"),
      photo("b", "2024-06-15T08:00:00Z"),
      photo("c", "2024-06-18T08:00:00Z"),
    ]
    const labels = groupPhotosByDay(photos).map((g) => g.label)
    expect(labels).toEqual(["2024-06-15", "2024-06-18", "2024-06-20"])
  })

  it("orders photos within a day ascending by time", () => {
    const photos = [
      photo("late", "2024-06-15T18:00:00Z"),
      photo("early", "2024-06-15T08:00:00Z"),
      photo("mid", "2024-06-15T12:00:00Z"),
    ]
    const ids = groupPhotosByDay(photos)[0].photos.map((p) => p.id)
    expect(ids).toEqual(["early", "mid", "late"])
  })

  it("places undated photos in a trailing 'Unknown Date' group", () => {
    const photos = [
      photo("dated", "2024-06-15T08:00:00Z"),
      photo("nodate1", null),
      photo("nodate2", null),
    ]
    const groups = groupPhotosByDay(photos)
    expect(groups).toHaveLength(2)
    expect(groups[1].label).toBe("Unknown Date")
    expect(groups[1].photos.map((p) => p.id)).toEqual(["nodate1", "nodate2"])
  })

  it("'Unknown Date' is the only group when all photos lack takenAt", () => {
    const photos = [photo("a", null), photo("b", null)]
    const groups = groupPhotosByDay(photos)
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBe("Unknown Date")
    expect(groups[0].photos).toHaveLength(2)
  })

  it("'Unknown Date' always appears last, after dated groups", () => {
    const photos = [
      photo("nodate", null),
      photo("dated", "2024-06-15T08:00:00Z"),
    ]
    const labels = groupPhotosByDay(photos).map((g) => g.label)
    expect(labels[labels.length - 1]).toBe("Unknown Date")
    expect(labels[0]).toBe("2024-06-15")
  })

  it("handles a single dated photo", () => {
    const photos = [photo("solo", "2024-01-01T00:00:00Z")]
    const groups = groupPhotosByDay(photos)
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBe("2024-01-01")
    expect(groups[0].photos[0].id).toBe("solo")
  })

  it("does not mutate the original photos array", () => {
    const photos = [
      photo("b", "2024-06-16T08:00:00Z"),
      photo("a", "2024-06-15T08:00:00Z"),
    ]
    const originalOrder = photos.map((p) => p.id)
    groupPhotosByDay(photos)
    expect(photos.map((p) => p.id)).toEqual(originalOrder)
  })
})
