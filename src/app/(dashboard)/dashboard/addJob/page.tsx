"use client"



import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader, Send } from "lucide-react"
import { z } from "zod";
import { jobDescriptionSchema } from "@/schemas/jobDescriptionSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { useAuth } from "@/hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { getCookie } from "cookies-next";
import Loading from "@/components/loading";

type jobDescriptionSchema = z.infer<typeof jobDescriptionSchema>

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}


const AddJob = () => {

    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth();

    const { register, handleSubmit, reset } = useForm<jobDescriptionSchema>(
        {
            resolver: zodResolver(jobDescriptionSchema),
            defaultValues: {
                jobData: "",
            }
        }
    )

    //console.log("Checking this user id from add jobs", user);

    const onSubmit = async (formData: jobDescriptionSchema) => {

        setIsLoading(true)
        try {
            if (!user) {
                toast.error("User is not logged in");
                setIsLoading(false);
                return;
            }
            //console.log("data sending for loggedin user", user.id, formData.jobData);

            const token = getCookie("accessToken");

            // replacing all the new line characters with space
            const formattedJobData = formData.jobData.replace(/\n/g, " "); // Replace newlines with spaces
            const response = await axios.post(
                `${baseUrl}/job/generateJobs`,
                { id: user.id, prompt: formattedJobData }, // Ensure correct field names
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", // Ensure JSON format
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Job added successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                })
                // Reset the input field after successful submission
                reset();
            }
        } catch (error) {
            const errorMessage = (axios.isAxiosError(error) && error.response?.data?.message) || "Failed to add job"
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            })
            console.error("Error adding job:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1 w-12 h-12" size="lg" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </div>
                    </header>

                    <div className="space-y-8 mx-7 mt-10">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">Add New Job</h1>
                        <Card className="bg-white dark:bg-gray-800 shadow-lg xl:w-1/2 mx-auto">
                            <CardHeader>
                                <CardTitle className="text-xl xl:text-2xl font-semibold text-gray-800 dark:text-gray-100">Enter Job Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <Textarea
                                        {...register("jobData", { required: true })} // Fix the syntax here
                                        placeholder="Paste job description or enter details here..."
                                        rows={10}
                                        className="w-full resize-none bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader className="animate-spin h-5 w-5" /> Processing
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Submit
                                            </>
                                        )}
                                    </Button>
                                </form>
                                {/* {successMessage && (
                                <p className="mt-4 text-green-600 dark:text-green-400 text-center font-semibold">{successMessage}</p>
                            )} */}
                            </CardContent>
                        </Card>
                    </div>
                </SidebarInset>
            </SidebarProvider>
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

export default AddJob;