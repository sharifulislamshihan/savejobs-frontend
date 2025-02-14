"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseUrl } from "@/lib/baseUrl";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const Verify = () => {
    const [code, setCode] = useState("")
    const params = useParams<{ email: string }>()
    const decodedEmail = decodeURIComponent(params.email)
    const [timeLeft, setTimeLeft] = useState(600) // Default 10 mins
    const [isLoading, setIsLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const router = useRouter()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const { register, handleSubmit } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    // Fetch expiry time from backend on component mount
    useEffect(() => {
        const fetchVerificationExpiry = async () => {
            try {
                const response = await axios.get(`${baseUrl}user/email/${decodedEmail}`)

                // Get expiry time from backend
                const expiryTime = new Date(response.data.data.verificationCodeExpiration).getTime();
                //const expiryTime = response.data.data.verificationCodeExpiration
                console.log("expiryTime", expiryTime);

                const now = Date.now()
                const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000))

                setTimeLeft(remaining)

                if (remaining > 0) {
                    localStorage.setItem('verificationEndTime', expiryTime.toString())
                }
            } catch (error) {
                console.error("Failed to fetch verification expiry time", error)
            }
        }

        fetchVerificationExpiry()
    }, [decodedEmail])

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => clearInterval(timerRef.current!)
    }, [timeLeft])

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true)

        try {
            const response = await axios.post(`${baseUrl}auth/verify`, {
                email: decodedEmail,
                verificationCode: data.code
            })

            if (response.status === 200) {
                toast.success(response.data.message, { position: "top-right", autoClose: 3000 })
                router.replace("/login")
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "An error occurred"
            toast.error(errorMessage, { position: "top-right", autoClose: 3000 })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (timeLeft > 0) return // Prevent resend if timer is still running

        setResending(true)
        try {
            const response = await axios.post(`${baseUrl}auth/resend-code`, { email: decodedEmail })
            if (response.data.success) {
                const newEndTime = Date.now() + 600 * 1000
                localStorage.setItem('verificationEndTime', newEndTime.toString())
                setTimeLeft(600)

                toast.success("Verification code resent successfully", { position: "top-right", autoClose: 3000 })
            }
        } catch (error) {
            console.log("Failed to resend verification code", error);

            toast.error("Failed to resend verification code", { position: "top-right", autoClose: 3000 })
        } finally {
            setResending(false)
        }
    }


    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60

        // Convert numbers to strings and pad with leading zeros if needed
        // padStart(2, "0") ensures each number is at least 2 digits
        // Example: 9 becomes "09", 59 stays "59"
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl mx-5">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-blue-500">Verify Your Email</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">We&apos;ve sent a verification code to your email</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Verification Code
                        </label>
                        <input
                            {...register("code", { required: true })}
                            type="text"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Verify"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Time remaining: <span className="font-medium text-blue-600 dark:text-blue-500">{formatTime(timeLeft)}</span>
                    </p>
                </div>
                {timeLeft === 0 && (
                    <button
                        onClick={handleResendCode}
                        disabled={resending}
                        className="w-full mt-4 py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {resending ? <Loader className="animate-spin h-4 w-4 mr-2" /> : "Resend Verification Code"}
                    </button>
                )}
            </div>
            <ToastContainer />
        </div>
    )
}

export default Verify
