"use client"

import { useState, useEffect, useRef } from "react" // Add useEffect
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { toast } from "react-toastify"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { baseUrl } from "@/lib/baseUrl"
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema"
import Loading from "@/components/loading"


const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600) // 2 minutes timer
    const router = useRouter()
    const params = useParams<{ email: string }>()
    const decodedEmail = decodeURIComponent(params.email)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    //const decodedEmail = params.email


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
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

    // Add format time function
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60

        // Convert numbers to strings and pad with leading zeros if needed
        // padStart(2, "0") ensures each number is at least 2 digits
        // Example: 9 becomes "09", 59 stays "59"
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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

                toast.success("Verification code resent successfully",
                    {
                        position: "top-right",
                        autoClose: 2000
                    })
            }
        } catch (error) {
            console.log("Failed to resend verification code", error);

            toast.error("Failed to resend verification code", 
                { 
                    position: "top-right", 
                    autoClose: 2000 
                })
        } finally {
            setResending(false)
        }
    }

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${baseUrl}auth/resetPassword`, {
                email: decodedEmail,
                verificationCode: data.verificationCode,
                newPassword: data.newPassword
            })

            if (response.status === 200) {
                toast.success("Password reset successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                })
                router.push('/login')
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to reset password"
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 shadow-xl">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Enter the verification code sent to your email and your new password
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                {...register("verificationCode")}
                                type="text"
                                placeholder="Enter verification code"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                    ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.verificationCode && (
                                <p className="text-sm text-red-500">{errors.verificationCode.message}</p>
                            )}
                            {/* Add timer display */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Time remaining: <span className="font-medium text-blue-600 dark:text-blue-500">{formatTime(timeLeft)}</span>
                                </p>
                            </div>
                            {timeLeft === 0 && (
                                <button
                                    onClick={handleResendCode}
                                    disabled={resending}
                                    className="text-blue-600 text-underlined hover:text-blue-700 focus:outline-none"
                                >
                                    {resending ? <Loader className="animate-spin h-4 w-4 mr-2" /> : "Resend Verification Code"}
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Input
                                {...register("newPassword")}
                                type="password"
                                placeholder="Enter new password"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                    ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Confirm new password"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                    ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loading />
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword