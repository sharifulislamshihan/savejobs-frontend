"use client"



import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"

const AddJob = () => {

    const [jobDescription, setJobDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMessage("")

        // Simulating API call to Gemini and saving to MongoDB
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsLoading(false)
        setSuccessMessage("Job successfully added!")
        setJobDescription("")
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 w-12 h-12" size="lg" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="space-y-8 mx-7 mt-10">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">Add New Job</h1>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg xl:w-1/2 mx-auto">
                        <CardHeader>
                            <CardTitle className="text-xl xl:text-2xl font-semibold text-gray-800 dark:text-gray-100">Enter Job Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Textarea
                                    placeholder="Paste job description or enter details here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    rows={10}
                                    className="w-full resize-none bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !jobDescription.trim()}
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
                            {successMessage && (
                                <p className="mt-4 text-green-600 dark:text-green-400 text-center font-semibold">{successMessage}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AddJob;