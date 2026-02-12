import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Clock, Layers, LayoutGrid, Map } from "lucide-react"

export type ViewMode = "timeline" | "map" | "grid"

interface ViewModeSwitcherProps {
  activeMode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export function ViewModeSwitcher({ activeMode, onModeChange }: ViewModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const viewModes = [
    { id: "timeline" as ViewMode, label: "Timeline", icon: Clock },
    { id: "map" as ViewMode, label: "Map", icon: Map },
    { id: "grid" as ViewMode, label: "Grid", icon: LayoutGrid },
  ]

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return
      const root = rootRef.current
      if (!root) return
      if (root.contains(target)) return
      setIsOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
    }
  }, [isOpen])

  const handleModeSelect = (mode: ViewMode) => {
    onModeChange(mode)
    setIsOpen(false)
  }

  return (
    <div ref={rootRef} className="absolute top-6 right-6 z-50">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-center rounded-lg border border-white/10 bg-[#1A1A1A] p-3 text-white shadow-lg hover:bg-white/5 transition-colors"
        aria-label="Switch view mode"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Layers className="h-5 w-5" />
      </button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="view-mode-menu"
            role="menu"
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-44 rounded-xl border border-white/10 bg-[#1A1A1A] p-2 shadow-2xl"
          >
            {viewModes.map((mode) => {
              const Icon = mode.icon
              const isActive = activeMode === mode.id
              return (
                <button
                  key={mode.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleModeSelect(mode.id)}
                  className={[
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-[#3C4741] text-white" : "text-[#9A9C9B] hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {mode.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
