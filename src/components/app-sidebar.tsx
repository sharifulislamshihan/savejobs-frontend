"use client"

import {
    LayoutDashboard, Briefcase, PlusCircle,
    Settings2,
} from "lucide-react"
import React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ModeToggle } from "./modeToggle"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },

    // Navigation data
    navMain: [
        {
            title: "Overview",
            url: "#",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "My Jobs",
            url: "#",
            icon: Briefcase,
        },
        {
            title: "Add Job",
            url: "#",
            icon: PlusCircle,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar className="bg-[#f4f5f4] dark:bg-[#201c1c] shadow-lg transition-all duration-300" variant="inset" {...props}>
            <SidebarHeader className="bg-[#f4f5f4] dark:bg-[#201c1c]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex justify-between">
                                <div>
                                    <Link href="/">
                                        <div className="grid flex-1 text-center text-4xl leading-tight">
                                            <span className="truncate font-semibold">Save Jobs</span>
                                        </div>
                                    </Link>
                                </div>

                                <div>
                                    <ModeToggle />
                                </div>
                            </div>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="bg-[#f4f5f4] dark:bg-[#201c1c] text-6xl">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="bg-[#f4f5f4] dark:bg-[#201c1c]">
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
