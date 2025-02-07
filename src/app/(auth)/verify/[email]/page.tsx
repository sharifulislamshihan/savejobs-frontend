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
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()


    const { register, handleSubmit } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    useEffect(() => {
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
    }, [])

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true)

        try {

            const response = await axios.post(`${baseUrl}auth/verify`, {
                email: params.email,
                verificationCode: data.code
            }
            )
            console.log(response);
            console.log("Email: ", params.email);
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
            
            toast.error(error.response?.data?.message || "An error occurred", {
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

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     setIsLoading(true)
    //     // Here you would typically send the verification code to your server
    //     await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulating API call
    //     setIsLoading(false)
    //     // Redirect to login page if verification is successful
    //     router.push("/login")
    // }

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
                    <p className="mt-2 text-gray-600 dark:text-gray-400">We've sent a verification code to your email</p>
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
                </div>
                {timeLeft === 0 && (
                    <p className="mt-4 text-center text-sm text-red-600 dark:text-red-500">
                        The verification code has expired. Please request a new one.
                    </p>
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