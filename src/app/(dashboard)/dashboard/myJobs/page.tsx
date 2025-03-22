// frontend/app/jobs/page.tsx
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

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
                const response = await axios.get("http://localhost:5000/job/user-jobs", {
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
                `http://localhost:5000/job/${jobId}`,
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
            const response = await axios.delete(`http://localhost:5000/job/${jobId}`, {
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

    const handleDeleteSelected = async () => {
        try {
            const token = getCookie("accessToken");
            const response = await axios.delete("http://localhost:5000/job/multiple", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { jobIds: selectedJobs },
            });

            if (response.data.success) {
                setJobs(jobs.filter((job) => !selectedJobs.includes(job._id)));
                setSelectedJobs([]);
                toast.success("Selected jobs deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete selected jobs");
        }
    };

    const handleDeleteAll = async () => {
        try {
            const token = getCookie("accessToken");
            const response = await axios.delete("http://localhost:5000/job/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setJobs([]);
                setSelectedJobs([]);
                toast.success("All jobs deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete all jobs");
        }
    };

    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {/* Header */}
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1 w-12 h-12" size="lg" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </div>
                    </header>

                    {/* Job Table */}
                    <div className="mx-4 md:mx-7">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Job Listings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
                                    <div className="flex items-center space-x-2 w-full md:w-auto">
                                        <Input
                                            placeholder="Search by company..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-sm"
                                        />
                                        <Button variant="outline" size="icon">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="destructive"
                                            onClick={() => setDeleteDialogOpen(true)}
                                            disabled={selectedJobs.length === 0}
                                            className="w-full md:w-auto"
                                        >
                                            Delete Selected
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full md:w-auto">
                                                    Actions <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => setDeleteAllDialogOpen(true)}>
                                                    Delete All Jobs
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]">
                                                        <Checkbox
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
                                            <TableBody>
                                                {filteredJobs.map((job) => (
                                                    <TableRow
                                                        key={job._id}
                                                        onClick={() => router.push(`/jobs/${job._id}`)}
                                                        className="cursor-pointer hover:bg-gray-800"
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
                                                                <SelectContent className="bg-black">
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
                                                                    onClick={() => router.push(`/jobs/${job._id}`)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => router.push(`/jobs/${job._id}/edit`)}
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

                    {/* Delete Confirmation Dialogs */}
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {jobToDelete ? "Delete Job" : "Delete Selected Jobs"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {jobToDelete
                                        ? "Are you sure you want to delete this job? This action cannot be undone."
                                        : "Are you sure you want to delete the selected jobs? This action cannot be undone."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        if (jobToDelete) {
                                            handleDelete(jobToDelete);
                                            setJobToDelete(null);
                                        } else {
                                            handleDeleteSelected();
                                        }
                                    }}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete All Jobs</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete all jobs? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAll}>Delete</AlertDialogAction>
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