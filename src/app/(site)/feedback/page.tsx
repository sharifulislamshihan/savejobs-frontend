"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Feedback() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [feedback, setFeedback] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Here you would typically send the feedback to your server
        // For this example, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Reset form and show success message
        setName("")
        setEmail("")
        setFeedback("")
        setIsSubmitting(false)
        alert("Thank you for your feedback!")
        router.push("/")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
                        We value your feedback
                    </h2>
                    <p className="mt-2 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        Your input helps us improve our service
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 transition-colors duration-200"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 transition-colors duration-200"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="feedback" className="sr-only">
                                Feedback
                            </label>
                            <textarea
                                id="feedback"
                                name="feedback"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 transition-colors duration-200"
                                placeholder="Your feedback"
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 dark:shadow-blue-500/50 shadow-lg"
                        >
                            {isSubmitting ? "Sending..." : "Send Feedback"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}




