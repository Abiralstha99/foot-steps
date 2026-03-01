import { cn } from "@/lib/utils"

export type TripTab = "grid" | "timeline" | "map"

const TABS: { id: TripTab; label: string }[] = [
    { id: "grid", label: "Grid" },
    { id: "timeline", label: "Timeline" },
    { id: "map", label: "Map" },
]

type TripTabBarProps = {
    activeTab: TripTab
    onTabChange: (tab: TripTab) => void
}

export function TripTabBar({ activeTab, onTabChange }: TripTabBarProps) {
    return (
        <div className="flex border-b border-border-token px-6">
            {TABS.map(({ id, label }) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => onTabChange(id)}
                    className={cn(
                        "h-10 px-4 text-sm font-medium transition-colors border-b-2 -mb-px",
                        activeTab === id
                            ? "text-accent border-accent"
                            : "text-text-secondary border-transparent hover:text-text-primary"
                    )}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}
