// frontend/app/jobs/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Calendar, MapPin, Briefcase, DollarSign, FileText, Link as LinkIcon } from "lucide-react";
import { getCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { baseUrl } from "@/lib/baseUrl";

type Job = {
    _id: string;
    company: string;
    position: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    expectedSalary: string;
    applicationDeadline: string | null;
    description: string;
    skillsRequired: string[];
    keyResponsibilities: string[];
    perksAndBenefits: string[];
    applicationLink: string;
    status: string;
    sourceLink: string;
    applyLink: string;
    instruction: string;
    hrEmail: string;
    interviewDate: string | null;
    notes: string;
    createdAt: string;
    updatedAt: string;
};

const JobDetail = () => {
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchJob = async () => {
            setIsLoading(true);
            const token = getCookie("accessToken");

            if (!token) {
                toast.error("Authentication token not found");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}job/user-jobs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setJob(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch job details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = getCookie("accessToken");
            const response = await axios.delete(`${baseUrl}job/user-jobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Job deleted successfully");
                router.push("/dashboard/myJobs");
            }
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
                <span className="text-gray-900 dark:text-gray-100">Job not found</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {/* Header */}
                    <header className="sticky top-0 z-10 bg-white dark:bg-[#19191b] border-b dark:border-gray-800">
                        <div className="flex h-16 items-center gap-4 px-4">
                            <SidebarTrigger className="w-10" />
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex flex-1 items-center gap-4">
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Job Details</h1>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="mx-4 md:mx-7 py-6">
                        <div className="max-w-4xl mx-auto">
                            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                                {job.position}
                                            </CardTitle>
                                            <p className="text-lg text-gray-600 dark:text-gray-400">{job.company}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button 
                                                onClick={() => router.push(`/dashboard/myJobs/${id}/edit`)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                onClick={() => setDeleteDialogOpen(true)}
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                <Trash className="h-4 w-4 mr-2" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Overview Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Location</p>
                                                <p className="text-gray-900 dark:text-gray-100">{job.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Employment Type</p>
                                                <p className="text-gray-900 dark:text-gray-100">{job.employmentType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Salary Range</p>
                                                <p className="text-gray-900 dark:text-gray-100">{job.salaryRange}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Expected Salary</p>
                                                <p className="text-gray-900 dark:text-gray-100">{job.expectedSalary}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Application Deadline</p>
                                                <p className="text-gray-900 dark:text-gray-100">{job.applicationDeadline || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-400">Status</p>
                                                <p className={`text-gray-900 dark:text-gray-100 ${job.status === "Accepted" ? "text-green-500" : job.status === "Rejected" ? "text-red-500" : ""}`}>
                                                    {job.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{job.description}</p>
                                    </div>

                                    {/* Skills and Responsibilities */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills Required</h3>
                                            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                                                {job.skillsRequired.map((skill, index) => (
                                                    <li key={index}>{skill}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Responsibilities</h3>
                                            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                                                {job.keyResponsibilities.map((responsibility, index) => (
                                                    <li key={index}>{responsibility}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Perks and Links */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Perks and Benefits</h3>
                                            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                                                {job.perksAndBenefits.map((perk, index) => (
                                                    <li key={index}>{perk}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Links</h3>
                                            <div className="space-y-2">
                                                <p className="flex items-center space-x-2">
                                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                                    <a href={job.applicationLink} className="text-blue-400 hover:underline">{job.applicationLink || "N/A"}</a>
                                                </p>
                                                <p className="flex items-center space-x-2">
                                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                                    <a href={job.sourceLink} className="text-blue-400 hover:underline">{job.sourceLink || "N/A"}</a>
                                                </p>
                                                <p className="flex items-center space-x-2">
                                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                                    <a href={job.applyLink} className="text-blue-400 hover:underline">{job.applyLink || "N/A"}</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Additional Information</h3>
                                            <p className="text-gray-600 dark:text-gray-400"><strong>Instruction:</strong> {job.instruction || "N/A"}</p>
                                            <p className="text-gray-600 dark:text-gray-400"><strong>HR Email:</strong> {job.hrEmail || "N/A"}</p>
                                            <p className="text-gray-600 dark:text-gray-400"><strong>Interview Date:</strong> {job.interviewDate || "N/A"}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Notes</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{job.notes || "N/A"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                                    Delete Job
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete this job? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    className="bg-red-500 hover:bg-red-600 text-white" 
                                    onClick={handleDelete}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

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
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default JobDetail;