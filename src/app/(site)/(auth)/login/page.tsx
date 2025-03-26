"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { logInSchema } from "@/schemas/loginSchema"
import axios from "axios"
import { baseUrl } from "@/lib/baseUrl"
import { toast, ToastContainer } from "react-toastify"
import { setCookie } from 'cookies-next';
import { useAuth } from "@/hooks/useAuth"

const Login = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const { setUser } = useAuth();

    // zod implementation 
    const { register, handleSubmit } = useForm<z.infer<typeof logInSchema>>({
        resolver: zodResolver(logInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof logInSchema>) => {
        setIsLoading(true)
        try {
            //console.log("data sending for loggedin user", data);
            const response = await axios.post(`${baseUrl}//auth/login`, data, {
                withCredentials: true, // Required to receive refreshToken cookie
                headers: {
                    "Content-Type": "application/json",
                },
            });
            //console.log("response", response);
            //console.log("token", response.data.accessToken);

            //  // Store token in both localStorage and cookies
            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                setCookie("accessToken", response.data.accessToken, {
                    maxAge: 15 * 24 * 60 * 60, // 15 days
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Match backend
                });
                setUser(response.data.user);
            }

            if (response.status === 200) {
                toast.success("Logged in successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                router.push("/dashboard")
                //console.log("User logged in successfully");
            }
        } catch (error) {

            console.error("Failed to login", error);
            const errorMessage = axios.isAxiosError(error)
                ? error.response?.data?.message || "Invalid email or password"
                : "Something went wrong";

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
    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl mx-4">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: "Invalid email address"
                                }
                            })}
                            type="email"
                            autoComplete="email"
                            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password", {
                                    required: "Password is required"
                                })}
                                type={showPassword ? "text" : "password"}
                                className="block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <Link href="/forgetPassword" className="block">
                            <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300">
                                Forgot Password?
                            </p>
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader className="h-7 w-7 animate-spin" />)
                            :
                            ("Sign In")}
                    </button>
                </form>

                <div className="relative">
                    {/* <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div> */}


                    {/* this is for google sign */}
                    {/* <div className="relative flex justify-center text-base">
                        <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                            Or continue with
                        </span>
                    </div> */}
                </div>

                {/* ... Google sign in button (if needed) ... */}

                <p className="text-center text-base text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Sign up
                    </Link>
                </p>
            </div>



            {/* for toast */}
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
    );
};

export default Login;