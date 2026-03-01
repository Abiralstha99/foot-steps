export type TagCategory = "landmark" | "scene" | "object"

const LANDMARK_KEYWORDS = [
  "tower", "palace", "castle", "cathedral", "temple", "mosque", "church",
  "bridge", "monument", "museum", "square", "plaza", "gate", "arch",
  "pyramid", "colosseum", "parthenon", "statue", "fountain", "basilica",
  "abbey", "chapel", "shrine", "pagoda", "minaret", "amphitheatre",
]

const SCENE_KEYWORDS = [
  "beach", "mountain", "forest", "ocean", "sea", "lake", "river", "desert",
  "sky", "sunset", "sunrise", "night", "landscape", "nature", "outdoor",
  "indoor", "urban", "rural", "city", "countryside", "snow", "rain",
  "valley", "cliff", "waterfall", "island", "coast", "horizon",
]

/**
 * Infers a display category from a raw AI tag string.
 * Pure function — no side effects.
 */
export function categorizeTag(tag: string): TagCategory {
  const lower = tag.toLowerCase()
  if (LANDMARK_KEYWORDS.some((k) => lower.includes(k))) return "landmark"
  if (SCENE_KEYWORDS.some((k) => lower.includes(k))) return "scene"
  return "object"
}
