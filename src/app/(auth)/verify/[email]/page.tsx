"use client"

import { useState, useEffect } from "react"
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

const Verify = ({ }) => {
    const [code, setCode] = useState("")
    const params = useParams<{ email: string }>()
    const decodedEmail = decodeURIComponent(params.email)
    const [timeLeft, setTimeLeft] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedEndTime = localStorage.getItem('verificationEndTime')
            if (savedEndTime) {
                const endTime = parseInt(savedEndTime)
                const now = Date.now()
                const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
                return remaining || 0
            }
        }
        return 600 // 10 minutes in seconds
    })
    const [isLoading, setIsLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [resendCount, setResendCount] = useState(0)
    const router = useRouter()


    const { register, handleSubmit } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    useEffect(() => {
        // Set end time in localStorage when component mounts or when resend happens
        if (timeLeft === 600) {
            const endTime = Date.now() + timeLeft * 1000
            localStorage.setItem('verificationEndTime', endTime.toString())
            localStorage.setItem('resendCount', resendCount.toString())
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, resendCount]) // Add dependencies to restart timer

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true)

        try {

            const response = await axios.post(`${baseUrl}auth/verify`, {
                email: decodedEmail,
                verificationCode: data.code
            }
            )
            console.log(response);
            console.log("Email: ", decodedEmail);
            console.log("Code: ", data.code);


            if (response.status === 200) {
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }

            router.replace("/login")
        } catch (error) {
            console.error(error);

            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : "An error occurred";
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        finally {
            setIsLoading(false)
        }

    }

    const handleResendCode = async () => {
        setResending(true)
        try {
            console.log("Attempting to resend code to:", decodedEmail)
            
            const response = await axios.post(`${baseUrl}auth/resend-code`, {
                email: decodedEmail // Use decoded email
            })
            
            console.log("Resend response:", response.data)

            if (response.data.success) {
                toast.success("Verification code resent successfully", {
                    position: "top-right",
                    autoClose: 3000,
                })

                // Reset timer and increment resend count
                setTimeLeft(600)
                setResendCount(prev => prev + 1)

                // Update localStorage with new end time
                const endTime = Date.now() + 600 * 1000
                localStorage.setItem('verificationEndTime', endTime.toString())
            } else {
                throw new Error(response.data.message || "Failed to resend code")
            }

        } catch (error) {
            console.error("Resend error:", error)
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : "Failed to resend verification code";
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setResending(false)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
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
                            {
                            ...register("code",
                                {
                                    required: true,
                                }
                            )
                            }
                            type="text"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || timeLeft === 0}
                        >
                            {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Verify"}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Time remaining: <span className="font-medium text-blue-600 dark:text-blue-500">{formatTime(timeLeft)}</span>
                    </p>
                    {resendCount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            Verification code resent {resendCount} {resendCount === 1 ? 'time' : 'times'}
                        </p>
                    )}
                </div>
                {timeLeft === 0 && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-red-600 dark:text-red-500 mb-4">
                            The verification code has expired.
                        </p>
                        <button
                            onClick={handleResendCode}
                            disabled={resending}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {resending ? (
                                <>
                                    <Loader className="animate-spin h-4 w-4 mr-2" />
                                    Resending...
                                </>
                            ) : (
                                "Resend Verification Code"
                            )}
                        </button>
                    </div>
                )}
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>


    )
};

export default Verify;