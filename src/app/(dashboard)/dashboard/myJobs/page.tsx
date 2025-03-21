"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Loader2, ChevronDown } from "lucide-react"
// import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCookie } from "cookies-next";
import { baseUrl } from "@/lib/baseUrl";
import { toast, ToastContainer } from "react-toastify";

// Define the Job type based on your schema
type Job = {
    _id: string
    company: string
    position: string
    location: string
    employmentType: string
    salaryRange: string
    expectedSalary: string
    applicationDeadline: string | null
    description: string
    skillsRequired: string[]
    keyResponsibilities: string[]
    perksAndBenefits: string[]
    applicationLink: string
    status: "Not Applied" | "Applied" | "Interview Scheduled" | "Rejected" | "Accepted"
    sourceLink: string
    applyLink: string
    instruction: string
    hrEmail: string
    interviewDate: string | null
    notes: string
    createdAt: string
    updatedAt: string
}

const statusOptions = ["Not Applied", "Applied", "Interview Scheduled", "Rejected", "Accepted"]


const MyJobs = () => {



    const [jobs, setJobs] = useState<Job[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedJobs, setSelectedJobs] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // const fetchJobs = useCallback(async () => {
    //     const token = getCookie("accessToken")
    //     try {
    //         const response = await axios.get(`${baseUrl}job/jobs`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         setJobs(response.data)
    //         console.log("this is all the jobs of user", response.data);

    //         setIsLoading(false)
    //     } catch (error) {
    //         console.error("Error fetching jobs:", error)
    //         setIsLoading(false)
    //     }
    // }, [])

    // useEffect(() => {
    //     fetchJobs()
    // }, [fetchJobs])


    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            const token = getCookie("accessToken");
            console.log("this is the token", token);


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
                    console.log("this is the response", response.data.data);
                    setJobs(response.data.data);
                    toast.success("Jobs fetched successfully");
                }
                console.log("this is the response", jobs);
            } catch (error: unknown) {
                const errorMessage = axios.isAxiosError(error) && error.response?.data?.message ? error.response.data.message : "Failed to fetch jobs";
                toast.error(errorMessage);
                //console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [])

    // const debouncedUpdate = useCallback(
    //     debounce(async (jobId: string, field: string, value: any) => {
    //         try {
    //             await axios.patch(`/api/jobs/${jobId}`, { [field]: value })
    //             toast({
    //                 title: "Success",
    //                 description: "Job updated successfully.",
    //             })
    //         } catch (error) {
    //             console.error("Error updating job:", error)
    //             toast({
    //                 title: "Error",
    //                 description: "Failed to update job. Please try again.",
    //                 variant: "destructive",
    //             })
    //         }
    //     }, 500),
    //     [],
    // )

    // const handleEdit = (jobId: string, field: string, value: any) => {
    //     setJobs(jobs.map((job) => (job._id === jobId ? { ...job, [field]: value } : job)))
    //     debouncedUpdate(jobId, field, value)
    // }

    // const handleDelete = async (jobId: string) => {
    //     try {
    //         await axios.delete(`/api/jobs/${jobId}`)
    //         setJobs(jobs.filter((job) => job._id !== jobId))
    //         setSelectedJobs(selectedJobs.filter((id) => id !== jobId))
    //         console.log("Job deleted successfully.");

    //     } catch (error) {
    //         console.error("Error deleting job:", error)
    //         console.log("Failed to delete job. Please try again.");

    //     }
    // }

    // const handleMultiDelete = async () => {
    //     try {
    //         await axios.post("/api/jobs/bulk-delete", { ids: selectedJobs })
    //         setJobs(jobs.filter((job) => !selectedJobs.includes(job._id)))
    //         setSelectedJobs([])
    //         console.log("Selected jobs deleted successfully.");

    //     } catch (error) {
    //         console.error("Error deleting multiple jobs:", error)
    //         console.log("Failed to delete selected jobs. Please try again.");

    //     }
    // }

    // const handleDeleteAll = async () => {
    //     if (window.confirm("Are you sure you want to delete all jobs? This action cannot be undone.")) {
    //         try {
    //             await axios.delete("/api/jobs/all")
    //             setJobs([])
    //             setSelectedJobs([])
    //             console.log("All jobs deleted successfully.");

    //         } catch (error) {
    //             console.error("Error deleting all jobs:", error)
    //             console.log("Failed to delete all jobs. Please try again.");

    //         }
    //     }
    // }

    const filteredJobs = jobs.filter((job) => job.company.toLowerCase().includes(searchTerm.toLowerCase()))



    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>

                    {/* header */}
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1 w-12 h-12" size="lg" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </div>
                    </header>




                    {/* job table */}
                    <div className="mx-7">
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
                                            //onClick={handleMultiDelete}
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
                                            {/* <DropdownMenuContent>
                                            <DropdownMenuItem onClick={handleDeleteAll}>Delete All Jobs</DropdownMenuItem>
                                        </DropdownMenuContent> */}
                                        </DropdownMenu>
                                    </div>
                                </div>
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="overflow-auto rounded-lg border dark:border-gray-700">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]">
                                                        <Checkbox
                                                            checked={selectedJobs.length === jobs.length}
                                                            onCheckedChange={(checked) => {
                                                                setSelectedJobs(checked ? jobs.map((job) => job._id) : [])
                                                            }}
                                                        />
                                                    </TableHead>
                                                    <TableHead>Company</TableHead>
                                                    <TableHead className="hidden md:table-cell">Position</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                                                    <TableHead className="hidden xl:table-cell">Employment Type</TableHead>
                                                    <TableHead className="hidden xl:table-cell">Salary Range</TableHead>
                                                    <TableHead className="hidden xl:table-cell">Expected Salary</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Application Deadline</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Description</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Skills Required</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Responsibility</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Benefits</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Application Link</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Source</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Instruction</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Hr Email</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Interview Date</TableHead>
                                                    <TableHead className="hidden lg:table-cell">Notes</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredJobs.map((job) => (
                                                    <TableRow key={job._id}>

                                                        {/* CHECKBOX */}
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedJobs.includes(job._id)}
                                                                onCheckedChange={(checked) => {
                                                                    setSelectedJobs(
                                                                        checked ? [...selectedJobs, job._id] : selectedJobs.filter((id) => id !== job._id),
                                                                    )
                                                                }}
                                                            />
                                                        </TableCell>

                                                        {/* COMPANY */}
                                                        <TableCell>
                                                            <div className="group relative">
                                                                <div className="truncate max-w-[200px] cursor-pointer">
                                                                    {job.company}
                                                                </div>
                                                                <Input
                                                                    defaultValue={job.company}
                                                                    className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                                //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                                />
                                                            </div>
                                                        </TableCell>

                                                        {/* POSITION */}
                                                        <TableCell>
                                                            <div className="group relative">
                                                                <div className="truncate max-w-[200px] cursor-pointer">
                                                                    {job.position}
                                                                </div>
                                                                <Input
                                                                    defaultValue={job.position}
                                                                    className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                                //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                                />
                                                            </div>
                                                        </TableCell>

                                                        {/* LOCATION */}
                                                        <TableCell>
                                                            <div className="group relative">
                                                                <div className="truncate max-w-[200px] cursor-pointer">
                                                                    {job.location}
                                                                </div>
                                                                <Input
                                                                    defaultValue={job.location}
                                                                    className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                                //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                                />
                                                            </div>
                                                        </TableCell>

                                                        {/* EMPLOYMENT TYPE */}
                                                        <TableCell>
                                                            <div className="group relative">
                                                                <div className="truncate max-w-[200px] cursor-pointer">
                                                                    {job.employmentType}
                                                                </div>
                                                                <Input
                                                                    defaultValue={job.employmentType}
                                                                    className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                                //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                                />
                                                            </div>
                                                        </TableCell>

                                                        {/* SALARY RANGE */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.salaryRange}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.salaryRange}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>

                                                        {/* EXPECTED SALARY */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.expectedSalary}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.expectedSalary}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>

                                                        {/* APPLICATION DEADLINE */}
                                                        <TableCell className="hidden lg:table-cell">
                                                            <Input
                                                                type="date"
                                                            //value={job.applicationDeadline ? format(new Date(job.applicationDeadline), "yyyy-MM-dd") : ""}
                                                            //onChange={(e) => handleEdit(job._id, "applicationDeadline", e.target.value)}
                                                            />
                                                        </TableCell>

                                                        {/* DESCRIPTION */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.description}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.description}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>

                                                        {/* SKILLS REQUIRED */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.skillsRequired.join(", ")}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.skillsRequired.join(", ")}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>

                                                        {/* RESPONSIBILITY */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.keyResponsibilities.join(", ")}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.keyResponsibilities.join(", ")}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>


                                                        {/* BENEFITS */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.perksAndBenefits.join(", ")}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.perksAndBenefits.join(", ")}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>


                                                        {/* APPLICATION LINK */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.applicationLink}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.applicationLink}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>

                                                        {/* STATUS */}
                                                        <TableCell>
                                                            <Select value={job.status} //</TableCell>onValueChange={(value) => handleEdit(job._id, "status", value)}
                                                            >
                                                                <SelectTrigger className="w-[130px]">
                                                                    <SelectValue>{job.status}</SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {statusOptions.map((status) => (
                                                                        <SelectItem key={status} value={status}>
                                                                            {status}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>

                                                        {/* SOURCE */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.sourceLink}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.sourceLink}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>

                                                        {/* INSTRUCTION */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.instruction}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.instruction}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>


                                                        {/* HR EMAIL */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.hrEmail}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.hrEmail}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>



                                                        {/* INTERVIEW DATE */}
                                                        <TableCell className="hidden xl:table-cell">
                                                            <Input
                                                                value={job.interviewDate}
                                                            //onChange={(e) => handleEdit(job._id, "expectedSalary", e.target.value)}
                                                            />
                                                        </TableCell>



                                                        {/* APPLICATION LINK */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.applicationLink}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.applicationLink}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>



                                                        {/* NOTES */}
                                                        <TableCell>
                                                    <div className="group relative">
                                                        <div className="truncate max-w-[200px] cursor-pointer">
                                                            {job.notes}
                                                        </div>
                                                        <Input
                                                            defaultValue={job.notes}
                                                            className="absolute inset-0 opacity-0 focus:opacity-100 bg-white dark:bg-gray-800"
                                                            //onChange={(e) => handleEdit(job._id, "company", e.target.value)}
                                                        />
                                                    </div>
                                                </TableCell>



                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">Open menu</span>
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    {/* <DropdownMenuItem onClick={() => handleDelete(job._id)} className="text-red-600">
                                                                    Delete
                                                                </DropdownMenuItem> */}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
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
                </SidebarInset>
            </SidebarProvider>


            {/* for toast */}
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
    );
};

export default MyJobs;