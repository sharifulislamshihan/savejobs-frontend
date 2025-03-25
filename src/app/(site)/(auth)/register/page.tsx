"use client";

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Eye, EyeOff, Loader } from "lucide-react"
import { registerSchema } from "@/schemas/registerSchemas";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from "@/lib/baseUrl";

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>(
        {
            resolver: zodResolver(registerSchema),
            defaultValues: {
                name: "",
                email: "",
                password: "",
            }
        }
    )

    const onSubmit = async (data: RegisterFormData) => {
        setSubmitting(true)
        try {
            console.log("Sending data to backend:", data)
            const response = await axios.post(`${baseUrl}auth/register`, data)
            console.log("Backend response:", response.data)

            if (response.data.message === "User created successfully") {
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });



                // redirecting to verify page
                router.push(`/verify/${encodeURIComponent(data.email)}`);


            } else {
                toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }
        catch (error) {
            console.error("Error occurred while Registering. Try Again", error);
            const axiosError = error as AxiosError
            const errorMessage = (axiosError.response?.data as { message: string }).message || "Error occurred while Registering"

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 2000,
            });
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-xl shadow-2xl mx-5 my-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-black dark:text-white">Join <span className="text-blue-500">SaveJobs</span></h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-md font-medium text-gray-700 dark:text-gray-400">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-700 rounded-md text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            {...register("name",
                                {
                                    required: "Name is required",
                                    minLength: 3,
                                    maxLength: 50,
                                }
                            )}
                        />
                        <p>{errors.name?.message}</p>
                    </div>

                    <div>
                        <label className="block text-md font-medium text-gray-700 dark:text-gray-400">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-700 rounded-md text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            {...register("email",
                                {
                                    required: "Email is required",
                                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                }
                            )}
                        />
                        <p>{errors.email?.message}</p>
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 dark:text-gray-400">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-700 rounded-md text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                {...register("password",
                                    {
                                        required: "Password is required",
                                        minLength: 6,
                                    }
                                )}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 dark:text-gray-400 dark:hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-red-600 dark:text-red-500 text-sm mt-2">{errors.password?.message}</p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={submitting}
                        >
                            {submitting ? <Loader className="animate-spin h-5 w-5" /> : "Register"}
                        </button>
                    </div>
                </form>
                {/* <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path
                                        fill="#4285F4"
                                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                                    />
                                </g>
                            </svg>
                            Sign up with Google
                        </button>
                    </div>
                </div> */}
                <p className="mt-8 text-center text-sm text-gray-700 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
                        Sign in
                    </Link>
                </p>
            </div>

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

export default Register;