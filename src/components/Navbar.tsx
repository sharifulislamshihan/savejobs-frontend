"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "./modeToggle"

const Navbar = () => {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        // Check user authentication status here
        // For demo purposes, we'll just use a random boolean
        setIsLoggedIn(Math.random() < 0.5)
    }, [])

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Feedback", href: "/feedback" },
        { name: isLoggedIn ? "Logout" : "Login", href: isLoggedIn ? "/logout" : "/login" },
    ]

    return (
        <div className="bg-white dark:bg-black shadow-md dark:shadow-blue-900/20">
            <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200">
                                SaveJobs
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`ml-4 px-3 py-2 rounded-md text-lg font-medium transition-all duration-200 ease-in-out
                ${pathname === item.href
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* dark mood */}
                        <ModeToggle />

                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-in-out
                ${pathname === item.href
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50"
                                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* dark mood */}
                        <ModeToggle />

                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar

