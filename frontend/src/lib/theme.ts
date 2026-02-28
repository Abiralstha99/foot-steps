const STORAGE_KEY = "footprint-theme"

export function getTheme(): "dark" | "light" {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark") return stored
  return "dark"
}

export function setTheme(theme: "dark" | "light"): void {
  localStorage.setItem(STORAGE_KEY, theme)
  if (theme === "light") {
    document.documentElement.classList.add("light")
  } else {
    document.documentElement.classList.remove("light")
  }
}

export function initTheme(): void {
  setTheme(getTheme())
}
