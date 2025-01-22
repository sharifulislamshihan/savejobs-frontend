"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"



export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-4 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
        >
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
    )
}
