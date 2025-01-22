"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check user authentication status here
    // For demo purposes, we'll just use a random boolean
    setIsLoggedIn(Math.random() < 0.5)
  }, [])

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
          AI-Powered Job Saving Made Simple
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-gray-600 dark:text-gray-300 transition-colors duration-200">
          Focus on applying, while AI takes care of organizing, saving, and managing your job search.
        </p>
        <div className="mt-8">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-base sm:text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 dark:shadow-blue-500/50 shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

