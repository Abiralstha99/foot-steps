import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Home, Images, Map, Moon, Plane, Sun } from "lucide-react"
import { UserButton, useUser } from "@clerk/clerk-react"
import { Tooltip } from "radix-ui"

import { cn } from "@/lib/utils"
import { getTheme, setTheme } from "@/lib/theme"

const navItems = [
  { label: "Home", icon: <Home className="size-5" />, to: "/home" },
  { label: "My Trips", icon: <Images className="size-5" />, to: "/trips" },
  { label: "Explore", icon: <Map className="size-5" />, to: "/explore" },
]

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [theme, setCurrentTheme] = useState<"dark" | "light">(getTheme)
  const { user } = useUser()

  const handleThemeToggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    setCurrentTheme(next)
  }

  return (
    <Tooltip.Provider delayDuration={0}>
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "fixed left-0 top-0 h-screen z-40 flex flex-col",
          "bg-bg-surface border-r border-border-token",
          "transition-[width] duration-200 ease",
          isExpanded ? "w-[220px]" : "w-[52px]"
        )}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center px-3.5">
          <Plane className="size-5 shrink-0 text-accent" />
          {isExpanded && (
            <span className="ml-3 overflow-hidden whitespace-nowrap font-display font-bold text-sm text-text-primary">
              Footprint
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav className="mt-2 flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const navLink = (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center rounded border-l-2 text-sm font-medium transition-colors",
                    isExpanded ? "gap-3 px-2.5" : "justify-center px-0",
                    isActive
                      ? "border-accent bg-accent-subtle text-text-primary"
                      : "border-transparent text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                  )
                }
              >
                <span className="shrink-0">{item.icon}</span>
                {isExpanded && (
                  <span className="overflow-hidden whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            )

            if (!isExpanded) {
              return (
                <Tooltip.Root key={item.label}>
                  <Tooltip.Trigger asChild>{navLink}</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={8}
                      className="z-50 rounded bg-bg-raised px-2.5 py-1 text-xs font-medium text-text-primary shadow-md"
                    >
                      {item.label}
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              )
            }

            return <div key={item.label}>{navLink}</div>
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme toggle */}
        <div className="px-2 pb-1">
          {!isExpanded ? (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleThemeToggle}
                  className="flex h-10 w-full items-center justify-center rounded text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
                >
                  {theme === "dark" ? (
                    <Sun className="size-5 shrink-0" />
                  ) : (
                    <Moon className="size-5 shrink-0" />
                  )}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={8}
                  className="z-50 rounded bg-bg-raised px-2.5 py-1 text-xs font-medium text-text-primary shadow-md"
                >
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ) : (
            <button
              onClick={handleThemeToggle}
              className="flex h-10 w-full items-center gap-3 rounded px-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
            >
              {theme === "dark" ? (
                <Sun className="size-5 shrink-0" />
              ) : (
                <Moon className="size-5 shrink-0" />
              )}
              <span className="overflow-hidden whitespace-nowrap">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </button>
          )}
        </div>

        {/* User row */}
        <div className="shrink-0 border-t border-border-token px-2 py-3">
          <div
            className={cn(
              "flex h-10 items-center gap-3",
              isExpanded ? "px-1.5" : "justify-center"
            )}
          >
            <UserButton
              appearance={{
                elements: { avatarBox: "size-7" },
              }}
            />
            {isExpanded && (
              <span className="overflow-hidden whitespace-nowrap text-sm text-text-secondary">
                {user?.firstName ?? ""}
              </span>
            )}
          </div>
        </div>
      </aside>
    </Tooltip.Provider>
  )
}
