import { useState, useRef, useEffect } from "react"
import { MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

type DropdownMenuItem = {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

type DropdownMenuProps = {
  items: DropdownMenuItem[]
  className?: string
}

export function DropdownMenu({ items, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="rounded-md p-1.5 text-[#9A9C9B] hover:bg-[#1a1b1a] hover:text-white focus:outline-none focus:ring-2 focus:ring-app-accent transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[#2d302e] bg-[#0d0e0d] shadow-xl py-1"
        >
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                item.onClick()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#1a1b1a] transition-colors text-left"
            >
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
