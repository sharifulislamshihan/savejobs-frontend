"use client"

// Add these imports
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { deleteCookie } from "cookies-next"
import { toast } from "react-toastify"

import {
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

//import { useContext } from "react"
//import { AuthContext } from "@/context/AuthContext"

export interface User {
    name: string;
    email: string;
    image?: string;
}

const NavUser = () => {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const { user, setUser } = useAuth()
    //const auth = useContext(AuthContext)
    // //console.log("User from nav user", auth.user);
    //console.log("checking user image", user?.image );
    




    const handleLogout = () => {
        try {
            // Clear localStorage
            localStorage.removeItem('accessToken')

            // Clear cookie
            deleteCookie('accessToken')

            // Clear user context
            setUser(null)

            // Show success toast
            toast.success("Logged out successfully!", {
                position: "top-right",
                autoClose: 1000,
            })

            // Redirect to login
            router.push('/login')
        } catch {
            toast.error("Error logging out", {
                position: "top-right",
                autoClose: 2000,
            })
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-16 w-16 rounded-lg">
                                <AvatarImage src={user?.image} alt={user?.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-lg lg:text-xl leading-tight">
                                <span className="truncate font-semibold">{user?.name}</span>
                                <span className="truncate text-xs lg:text-sm">{user?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#f4f5f4] dark:bg-[#201c1c]"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user?.image} alt={user?.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user?.name}</span>
                                    <span className="truncate text-xs">{user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default NavUser;
