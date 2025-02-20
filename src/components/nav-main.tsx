"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    Collapsible,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
    }[]
}) {


    const pathname = usePathname()
    return (
        <SidebarGroup>
            <SidebarMenu className="space-y-2 mt-5">
                {items.map((item) => {
                    const isActive = pathname === item.url
                    return (
                        <Collapsible key={item.title} asChild>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "transition-all duration-200",
                                        isActive && "bg-blue-100 dark:bg-blue-900/30 border-r-4 border-blue-600 dark:border-blue-400",
                                        "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <Link href={item.url} className="flex items-center gap-2 py-7">
                                        <item.icon className={cn(
                                            "w-6 h-6",
                                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                                        )} />
                                        <span className={cn(
                                            "text-lg lg:text-xl xl:text-2xl",
                                            isActive ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                                        )}>
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
