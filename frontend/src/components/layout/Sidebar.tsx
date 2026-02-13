import React from "react"
import { NavLink } from "react-router-dom"
import {
    Compass,
    Home,
    Map,
    Menu,
    Settings,
} from "lucide-react"
import { UserButton, useUser } from "@clerk/clerk-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CreateTripModal } from "@/features/trips/components/CreateTripForm"

const SIDEBAR_WIDTH = 260

type NavItem = {
    label: string
    icon: React.ReactNode
    to: string
}

const mainNavItems: NavItem[] = [
    { label: "Home", icon: <Home className="size-4" />, to: "/home" },
    { label: "My Trips", icon: <Map className="size-4" />, to: "/trips" },
    { label: "Explore", icon: <Compass className="size-4" />, to: "/explore" },
]

const footerNavItems: NavItem[] = [
    { label: "Settings", icon: <Settings className="size-4" />, to: "/settings" },
]

function UserInfo() {
    const { user } = useUser()
    return (
        <div className="flex flex-col">
            <span className="text-xs font-medium text-white">
                {user?.firstName || "Traveler"}
            </span>
            <span className="text-[11px] text-[#9A9C9B]">
                View profile
            </span>
        </div>
    )
}

function SidebarNavList({ items }: { items: NavItem[] }) {
    return (
        <nav className="space-y-2">
            {items.map((item) => (
                <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }: { isActive: boolean }) =>
                        cn(
                            "group flex w-full items-center gap-3 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors no-underline",
                            // Active State
                            isActive
                                ? "bg-[#1A1A1A] text-white border-l-[3px] border-l-[#3C4741]"
                                : "text-[#9A9C9B] hover:text-[#54d354] border-l-[3px] border-l-transparent hover:border-l-[#3C4741] hover:bg-[#1A1A1A]"
                        )

                    }

                >
                    <span className="flex items-center justify-center rounded-md bg-[#070807] p-2 text-inherit group-hover:bg-[#1A1A1A]">
                        {item.icon}
                    </span>
                    <span className="text-inherit">
                        {item.label}
                        {item.label === "Explore" && (
                            <span className="ml-2 text-xs font-medium text-[#5B5D5C]">
                                (Coming Soon)
                            </span>
                        )}
                    </span>
                </NavLink>
            ))
            }
        </nav >
    )
}

export function Sidebar() {
    const [open, setOpen] = React.useState(false)
    const [createModalOpen, setCreateModalOpen] = React.useState(false)

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
                            foot-steps
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
                                foot-steps
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
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "size-8",
                                        userButtonPopoverCard: "bg-[#121212] border border-[#1A1A1A]",
                                        userButtonPopoverActionButton: "hover:bg-[#1A1A1A]"
                                    }
                                }}
                            />
                            <UserInfo />
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
                                    foot-steps
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
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "size-8",
                                        userButtonPopoverCard: "bg-[#121212] border border-[#1A1A1A]",
                                        userButtonPopoverActionButton: "hover:bg-[#1A1A1A]"
                                    }
                                }}
                            />
                            <UserInfo />
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Trip Modal */}
            <CreateTripModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
        </>
    )
}
