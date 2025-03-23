// frontend/app/jobs/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { jobSchema } from "@/schemas/jobSchema";
import { baseUrl } from "@/lib/baseUrl";

// Zod schema for form validation

type JobFormData = z.infer<typeof jobSchema>;

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

const statusOptions = ["Not Applied", "Applied", "Interview Scheduled", "Rejected", "Accepted"];

const EditJob = () => {
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = useParams();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            company: "",
            position: "",
            location: "",
            employmentType: "",
            salaryRange: "",
            expectedSalary: "",
            applicationDeadline: "",
            description: "",
            skillsRequired: [],
            keyResponsibilities: [],
            perksAndBenefits: [],
            applicationLink: "",
            sourceLink: "",
            applyLink: "",
            instruction: "",
            hrEmail: "",
            interviewDate: "",
            notes: "",
            status: "Not Applied",
        },
    });

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
                    const jobData = response.data.data;
                    setJob(jobData);
                    reset({
                        ...jobData,
                        skillsRequired: jobData.skillsRequired.join(", "),
                        keyResponsibilities: jobData.keyResponsibilities.join(", "),
                        perksAndBenefits: jobData.perksAndBenefits.join(", "),
                        applicationDeadline: jobData.applicationDeadline?.split("T")[0] || "",
                        interviewDate: jobData.interviewDate?.split("T")[0] || "",
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch job details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id, reset]);

    const onSubmit = async (data: JobFormData) => {
        try {
            const token = getCookie("accessToken");
            const response = await axios.put(`${baseUrl}job/user-jobs/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Job updated successfully");
                router.push("/dashboard/myJobs");
            }
        } catch (error) {
            toast.error("Failed to update job");
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><span>Loading...</span></div>;
    if (!job) return <div className="flex justify-center items-center h-screen"><span>Job not found</span></div>;

    return (
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

                {/* Main Content */}
                <div className="mx-4 md:mx-7 py-6">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Edit Job: {job.position} at {job.company}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Company</label>
                                            <Controller
                                                name="company"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.company && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.company.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Position</label>
                                            <Controller
                                                name="position"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.position && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.position.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Location</label>
                                            <Controller
                                                name="location"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.location && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.location.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Employment Type</label>
                                            <Controller
                                                name="employmentType"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.employmentType && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.employmentType.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Salary Range</label>
                                            <Controller
                                                name="salaryRange"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.salaryRange && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.salaryRange.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Expected Salary</label>
                                            <Controller
                                                name="expectedSalary"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.expectedSalary && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.expectedSalary.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Application Deadline</label>
                                            <Controller
                                                name="applicationDeadline"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        type="date" 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.applicationDeadline && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.applicationDeadline.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Status</label>
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger 
                                                            className="bg-gray-50 dark:bg-gray-700 
                                                                border-gray-300 dark:border-gray-600 
                                                                text-gray-900 dark:text-gray-100"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent 
                                                            className="bg-white dark:bg-gray-800 
                                                                border border-gray-200 dark:border-gray-700"
                                                        >
                                                            {statusOptions.map((status) => (
                                                                <SelectItem 
                                                                    key={status} 
                                                                    value={status}
                                                                    className="text-gray-900 dark:text-gray-100
                                                                        hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                >
                                                                    {status}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-gray-700 dark:text-gray-300">Description</label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea 
                                                    {...field} 
                                                    className="bg-gray-50 dark:bg-gray-700 
                                                        border-gray-300 dark:border-gray-600 
                                                        text-gray-900 dark:text-gray-100
                                                        focus:ring-blue-500 focus:border-blue-500 
                                                        dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Skills Required (comma-separated.)</label>
                                            <Controller
                                                name="skillsRequired"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.skillsRequired && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.skillsRequired.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Key Responsibilities (comma-separated)</label>
                                            <Controller
                                                name="keyResponsibilities"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.keyResponsibilities && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.keyResponsibilities.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Perks and Benefits (comma-separated)</label>
                                            <Controller
                                                name="perksAndBenefits"
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.perksAndBenefits && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.perksAndBenefits.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Application Link</label>
                                            <Controller
                                                name="applicationLink"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.applicationLink && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.applicationLink.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Source Link</label>
                                            <Controller
                                                name="sourceLink"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.sourceLink && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.sourceLink.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Apply Link</label>
                                            <Controller
                                                name="applyLink"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.applyLink && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.applyLink.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Instruction</label>
                                            <Controller
                                                name="instruction"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.instruction && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.instruction.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">HR Email</label>
                                            <Controller
                                                name="hrEmail"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.hrEmail && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.hrEmail.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-gray-700 dark:text-gray-300">Interview Date</label>
                                            <Controller
                                                name="interviewDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input 
                                                        type="date" 
                                                        {...field} 
                                                        className="bg-gray-50 dark:bg-gray-700 
                                                            border-gray-300 dark:border-gray-600 
                                                            text-gray-900 dark:text-gray-100
                                                            focus:ring-blue-500 focus:border-blue-500 
                                                            dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                    />
                                                )}
                                            />
                                            {errors.interviewDate && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.interviewDate.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-gray-700 dark:text-gray-300">Notes</label>
                                        <Controller
                                            name="notes"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea 
                                                    {...field} 
                                                    className="bg-gray-50 dark:bg-gray-700 
                                                        border-gray-300 dark:border-gray-600 
                                                        text-gray-900 dark:text-gray-100
                                                        focus:ring-blue-500 focus:border-blue-500 
                                                        dark:focus:ring-blue-400 dark:focus:border-blue-400" 
                                                />
                                            )}
                                        />
                                        {errors.notes && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.notes.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button 
                                            type="submit" 
                                            className="bg-blue-600 hover:bg-blue-700 text-white
                                                dark:bg-blue-500 dark:hover:bg-blue-600
                                                transition-colors duration-200"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="outline" 
                                            onClick={() => router.push('/dashboard/myJobs')}
                                            className="border-gray-300 dark:border-gray-600 
                                                text-gray-700 dark:text-gray-300
                                                hover:bg-gray-100 dark:hover:bg-gray-700
                                                transition-colors duration-200"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default EditJob;