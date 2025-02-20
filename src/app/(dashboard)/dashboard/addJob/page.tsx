"use client"



import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { z } from "zod";
import { jobDescriptionSchema } from "@/schemas/jobDescriptionSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { useAuth } from "@/hooks/useAuth";

type jobDescriptionSchema = z.infer<typeof jobDescriptionSchema>

const AddJob = () => {

    const [isLoading, setIsLoading] = useState(false)
    const {user} = useAuth();
    

    const { register, handleSubmit } = useForm<jobDescriptionSchema>(
        {
            resolver: zodResolver(jobDescriptionSchema),
            defaultValues: {
                jobData: "",
            }
        }
    )

    console.log("Checking this user from add jobs", user);
    
    const onSubmit = async (data: jobDescriptionSchema) => {
        setIsLoading(true)
        try {
            console.log("Sending id and job data to backend", data);
            const response = await axios.post(`${baseUrl}/job/generateJobs`, data)
            console.log("Response from backend", response);
            setIsLoading(false)
            
        } catch (error) {
            console.error(error)
            
        }
    }

    return (
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
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing
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
    );
};

export default AddJob;