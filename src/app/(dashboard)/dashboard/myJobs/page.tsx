"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, ChevronDown, Eye, Pencil, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/lib/baseUrl";

// Define the Job type based on your schema
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
    status: "Not Applied" | "Applied" | "Interview Scheduled" | "Rejected" | "Accepted";
    sourceLink: string;
    applyLink: string;
    instruction: string;
    hrEmail: string;
    interviewDate: string | null;
    notes: string;
    createdAt: string;
    updatedAt: string;
};

const statusOptions = ["Not Applied", "Applied", "Interview Scheduled", "Rejected", "Accepted"];

const MyJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            const token = getCookie("accessToken");

            if (!token) {
                toast.error("Authentication token not found");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}job/user-jobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setJobs(response.data.data);
                    toast.success("Jobs fetched successfully");
                }
            } catch (error: unknown) {
                const errorMessage =
                    axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Failed to fetch jobs";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = async (jobId: string, newStatus: "Not Applied" | "Applied" | "Interview Scheduled" | "Rejected" | "Accepted") => {
        try {
            const token = getCookie("accessToken");
            const response = await axios.put(
                `${baseUrl}job/user-jobs/${jobId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setJobs(jobs.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job)));
                toast.success("Status updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (jobId: string) => {
        try {
            const token = getCookie("accessToken");
            const response = await axios.delete(`${baseUrl}job/user-jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setJobs(jobs.filter((job) => job._id !== jobId));
                setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
                toast.success("Job deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {/* Header */}
                    <header className=" sticky top-0 z-10 bg-white dark:bg-[#19191b] border-b dark:border-gray-800">
                        <div className="flex h-16 items-center gap-4 px-4">
                            <SidebarTrigger className="w-10" />
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex flex-1 items-center gap-4">
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Jobs</h1>
                            </div>
                        </div>
                    </header>

                    {/* Job Table */}
                    <div className="mx-4 md:mx-7 py-6 overflow-x-scroll">
                        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                            <CardHeader className="border-b dark:border-gray-700">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Job Listings
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Search by company..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <Search className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="text-black dark:text-white">
                                                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                                                    <TableHead className="w-[50px]">
                                                        <Checkbox
                                                        className="border-black dark:border-white"
                                                            checked={selectedJobs.length === filteredJobs.length}
                                                            onCheckedChange={(checked) => {
                                                                setSelectedJobs(checked ? filteredJobs.map((job) => job._id) : []);
                                                            }}
                                                        />
                                                    </TableHead>
                                                    <TableHead>Company</TableHead>
                                                    <TableHead>Position</TableHead>
                                                    <TableHead className="hidden md:table-cell">Salary Range</TableHead>
                                                    <TableHead className="hidden md:table-cell">Expected Salary</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="text-black dark:text-white">
                                                {filteredJobs.map((job, index) => (
                                                    <TableRow
                                                        key={job._id}
                                                        onClick={() => router.push(`myJobs/${job._id}`)}
                                                        className={`
                                                            cursor-pointer
                                                            ${index % 2 === 0 
                                                                ? 'bg-white dark:bg-gray-800' 
                                                                : 'bg-gray-100 dark:bg-gray-900'}
                                                            hover:bg-blue-50 dark:hover:bg-blue-900/20
                                                            transition-colors duration-150
                                                        `}
                                                    >
                                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                                            <Checkbox
                                                                checked={selectedJobs.includes(job._id)}
                                                                onCheckedChange={(checked) => {
                                                                    setSelectedJobs(
                                                                        checked
                                                                            ? [...selectedJobs, job._id]
                                                                            : selectedJobs.filter((id) => id !== job._id)
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{job.company}</TableCell>
                                                        <TableCell>{job.position}</TableCell>
                                                        <TableCell className="hidden md:table-cell">{job.salaryRange}</TableCell>
                                                        <TableCell className="hidden md:table-cell">{job.expectedSalary}</TableCell>
                                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                                            <Select
                                                                value={job.status}
                                                                onValueChange={(value) => handleStatusChange(job._id, value as "Not Applied" | "Applied" | "Interview Scheduled" | "Rejected" | "Accepted")}
                                                            >
                                                                <SelectTrigger className="w-[150px]">
                                                                    <SelectValue>{job.status}</SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-gray-100 text-black dark:bg-gray-800 dark:text-white">
                                                                    {statusOptions.map((status) => (
                                                                        <SelectItem key={status} value={status}>
                                                                            {status}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => router.push(`myJobs/${job._id}`)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => router.push(`/dashboard/myJobs/${job._id}/edit`)}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        setJobToDelete(job._id);
                                                                        setDeleteDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Status Select Styling */}
                    <style jsx global>{`
                        .status-not-applied { @apply bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200; }
                        .status-applied { @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200; }
                        .status-interview { @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200; }
                        .status-rejected { @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200; }
                        .status-accepted { @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200; }
                    `}</style>

                    {/* Delete Confirmation Dialogs */}
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                                    {jobToDelete ? "Delete Job" : "Delete Selected Jobs"}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    {jobToDelete
                                        ? "Are you sure you want to delete this job? This action cannot be undone."
                                        : "Are you sure you want to delete the selected jobs? This action cannot be undone."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => {
                                        if (jobToDelete) {
                                            handleDelete(jobToDelete);
                                            setJobToDelete(null);
                                        } else {
                                            // handleDeleteSelected();
                                        }
                                    }}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                        <AlertDialogContent className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Delete All Jobs</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete all jobs? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Cancel</AlertDialogCancel>
                                {/* <AlertDialogAction onClick={handleDeleteAll}>Delete</AlertDialogAction> */}
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>


                    {/* Toast */}
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

export default MyJobs;