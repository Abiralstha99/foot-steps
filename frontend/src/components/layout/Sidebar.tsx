import React from "react"
import {
    Compass,
    Globe2,
    Map,
    Menu,
    PlusCircle,
    Settings,
    User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = 260

type NavItem = {
    label: string
    icon: React.ReactNode
}

const mainNavItems: NavItem[] = [
    { label: "My Trips", icon: <Map className="size-4" /> },
    { label: "Create Trip", icon: <PlusCircle className="size-4" /> },
    { label: "Explore", icon: <Globe2 className="size-4" /> },
]

const footerNavItems: NavItem[] = [
    { label: "Settings", icon: <Settings className="size-4" /> },
    { label: "Profile", icon: <User className="size-4" /> },
]

function SidebarNavList({ items }: { items: NavItem[] }) {
    return (
        <nav className="space-y-1">
            {items.map((item) => (
                <button
                    key={item.label}
                    type="button"
                    className={cn(
                        "group flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm font-medium",
                        "text-[#9A9C9B] hover:text-white",
                        "border-l-2 border-l-transparent hover:border-l-[#3C4741]",
                        "hover:bg-[#1A1A1A]"
                    )}
                >
                    <span className="flex items-center justify-center rounded-md bg-[#181818] p-2 text-[#9A9C9B] group-hover:bg-[#222222] group-hover:text-white">
                        {item.icon}
                    </span>
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    )
}

export function Sidebar() {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            {/* Mobile top bar */}
            <header className="flex items-center justify-between border-b border-[#1a1a1a] bg-[#070807]/95 px-4 py-3 md:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-[#3C4741]/15 text-[#3C4741]">
                        <Compass className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight text-white">
                            TravelJournal
                        </span>
                        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9A9C9B]">
                            Capture The Journey
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full bg-[#121212] text-[#EDEDED] hover:bg-[#1A1A1A]"
                    onClick={() => setOpen(true)}
                >
                    <Menu className="size-4" />
                </Button>
            </header>

            {/* Desktop sidebar */}
            <aside
                className="hidden md:flex md:flex-col md:justify-between"
                style={{
                    width: SIDEBAR_WIDTH,
                    position: "fixed",
                    insetBlock: 0,
                    insetInlineStart: 0,
                    backgroundColor: "#121212",
                }}
            >
                <div className="flex flex-1 flex-col gap-6 border-r border-[#1A1A1A] bg-[#121212]/95 px-5 py-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#3C4741]/15 text-[#3C4741] shadow-[0_0_0_1px_rgba(60,71,65,0.45)]">
                            <Compass className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight text-white">
                                TravelJournal
                            </span>
                            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9A9C9B]">
                                Photo Stories
                            </span>
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#5B5D5C]">
                                Library
                            </p>
                            <SidebarNavList items={mainNavItems} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#1A1A1A] bg-[#121212]/95 px-5 py-4">
                    <div className="space-y-3">
                        <SidebarNavList items={footerNavItems} />
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#181818] text-xs font-semibold text-white">
                                TJ
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white">
                                    Traveler in Focus
                                </span>
                                <span className="text-[11px] text-[#9A9C9B]">
                                    View profile
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile sheet / sidebar */}
            <div
                className={cn(
                    "fixed inset-0 z-40 transform transition-all duration-300 ease-out md:hidden",
                    open ? "visible opacity-100" : "invisible opacity-0"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
                {/* Panel */}
                <div
                    className={cn(
                        "relative flex h-full w-[80%] max-w-xs flex-col justify-between border-r border-[#1A1A1A] bg-[#121212] px-5 py-6 shadow-2xl",
                        open ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full bg-[#3C4741]/15 text-[#3C4741]">
                                <Compass className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold tracking-tight text-white">
                                    TravelJournal
                                </span>
                                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9A9C9B]">
                                    Photo Stories
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className="rounded-full bg-[#181818] text-[#EDEDED] hover:bg-[#1F1F1F]"
                            onClick={() => setOpen(false)}
                        >
                            <Menu className="size-3 rotate-90" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto pt-2">
                        <div className="space-y-2">
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#5B5D5C]">
                                Library
                            </p>
                            <SidebarNavList items={mainNavItems} />
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-[#1A1A1A] pt-4">
                        <SidebarNavList items={footerNavItems} />
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-[#181818] text-xs font-semibold text-white">
                                TJ
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white">
                                    Traveler in Focus
                                </span>
                                <span className="text-[11px] text-[#9A9C9B]">
                                    View profile
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

