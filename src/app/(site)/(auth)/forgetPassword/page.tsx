"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { baseUrl } from "@/lib/baseUrl"
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema"
import Loading from "@/components/loading"

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordData) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${baseUrl}auth/forgetPassword`, {
                email: data.email,
            })

            if (response.status === 200) {
                toast.success("Reset code sent to your email!", {
                    position: "top-right",
                    autoClose: 2000,
                })
                // Update this line to redirect to reset page instead of verify
                router.push(`/resetPassword/${encodeURIComponent(data.email)}`)
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Something went wrong"
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 shadow-xl">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Enter your email address and we&apos;ll send you a code to reset your password
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                                    ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 dark:text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                                text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <Loading />
                            ) : (
                                "Send Reset Code"
                            )}
                        </Button>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => router.push('/login')}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 
                                    dark:hover:text-blue-300"
                            >
                                Back to Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <ToastContainer
                position="top-right" 
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
}