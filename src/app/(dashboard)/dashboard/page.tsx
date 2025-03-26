// frontend/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseUrl } from "@/lib/baseUrl";

// Define types for the data
type JobStats = {
    totalJobs: number;
    applied: number;
    interviews: number;
    accepted: number;
    rejected: number;
    pending: number;
};

type UpcomingJob = {
    company: string;
    position: string;
    deadline?: string;
    interviewDate?: string;
};

type MonthlyTrend = {
    month: string;
    applications: number;
};

type JobSource = {
    source: string;
    jobs: number;
};



const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();
    const router = useRouter();

    // State for dashboard data
    const [stats, setStats] = useState<JobStats>({
        totalJobs: 0,
        applied: 0,
        interviews: 0,
        accepted: 0,
        rejected: 0,
        pending: 0,
    });
    const [upcoming, setUpcoming] = useState<{ deadlines: UpcomingJob[]; interviews: UpcomingJob[] }>({
        deadlines: [],
        interviews: [],
    });
    const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
    const [jobsBySource, setJobsBySource] = useState<JobSource[]>([]);


    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchDashboardData = async () => {
            const token = getCookie("accessToken");
            if (!token) {
                toast.error("Authentication token not found");
                return;
            }

            try {
                // Fetch Job Stats
                const statsResponse = await axios.get(`${baseUrl}/job/user-jobs/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (statsResponse.data.success) {
                    setStats(statsResponse.data.data);
                }

                // Fetch Upcoming Deadlines and Interviews
                const upcomingResponse = await axios.get(`${baseUrl}/job/user-jobs/upcoming`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (upcomingResponse.data.success) {
                    setUpcoming(upcomingResponse.data.data);
                }

                // Fetch Monthly Trend
                const trendResponse = await axios.get(`${baseUrl}/job/user-jobs/monthly-trend`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (trendResponse.data.success) {
                    setMonthlyTrend(trendResponse.data.data);
                }

                // Fetch Jobs by Source
                const sourceResponse = await axios.get(`${baseUrl}/job/user-jobs/jobs-by-source`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (sourceResponse.data.success) {
                    setJobsBySource(sourceResponse.data.data);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            }
        };

        fetchDashboardData();
    }, [user, router]);

    // Prepare Pie Chart Data
    const pieChartData = [
        { name: "Not Applied", value: stats.pending, color: "#3B82F6" },
        { name: "Applied", value: stats.applied, color: "#10B981" },
        { name: "Interview", value: stats.interviews, color: "#F59E0B" },
        { name: "Rejected", value: stats.rejected, color: "#EF4444" },
        { name: "Accepted", value: stats.accepted, color: "#8B5CF6" },
    ];


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
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-3 lg:mx-5 xl:mx-10">
                    <div className="space-y-8 mt-10">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>

                        {/* Job Statistics */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {[
                                { title: "Total Jobs", value: stats.totalJobs, icon: Briefcase, color: "text-blue-500" },
                                { title: "Applied Jobs", value: stats.applied, icon: FileText, color: "text-green-500" },
                                { title: "Interviews Scheduled", value: stats.interviews, icon: Clock, color: "text-yellow-500" },
                                { title: "Accepted Offers", value: stats.accepted, icon: CheckCircle, color: "text-purple-500" },
                                { title: "Rejected Applications", value: stats.rejected, icon: XCircle, color: "text-red-500" },
                            ].map((card) => (
                                <Card
                                    key={card.title}
                                    className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm lg:text-lg font-medium text-gray-600 dark:text-gray-300">
                                            {card.title}
                                        </CardTitle>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">{card.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts and Upcoming Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Charts Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 rounded-lg p-1 mb-4 gap-3">
                                    <TabsTrigger
                                        value="overview"
                                        className={`rounded-md px-4 py-2 ${activeTab === "overview" ? "bg-slate-700 text-white" : "bg-blue-700 dark:bg-blue-900"
                                            }`}
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="monthly"
                                        className={`rounded-md px-4 py-2 ${activeTab === "monthly" ? "bg-slate-700 text-white" : "bg-blue-700 dark:bg-blue-900"
                                            }`}
                                    >
                                        Monthly Trend
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="sources"
                                        className={`rounded-md px-4 py-2 ${activeTab === "sources" ? "bg-slate-700 text-white" : "bg-blue-700 dark:bg-blue-900"
                                            }`}
                                    >
                                        Job Sources
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview">
                                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-gray-800 dark:text-gray-100">Job Status Distribution</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[250px] sm:h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={pieChartData}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            label={({ name, percent }) => {
                                                                const percentage = percent * 100;
                                                                // Only show label if percentage is greater than 5%
                                                                return percentage > 5 ? `${name} ${percentage.toFixed(0)}%` : null;
                                                            }}
                                                            labelLine={true}
                                                        >
                                                            {pieChartData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        {/* Add a Legend to show all categories */}
                                                        <Legend
                                                            layout="vertical"
                                                            align="right"
                                                            verticalAlign="middle"
                                                            formatter={(value) => (
                                                                <span className="text-gray-800 dark:text-gray-100">{value}</span>
                                                            )}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="monthly">
                                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-gray-800 dark:text-gray-100">Monthly Job Applications Trend</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[250px] sm:h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={monthlyTrend}>
                                                        <XAxis dataKey="month" stroke="#888888" />
                                                        <YAxis stroke="#888888" />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="sources">
                                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-gray-800 dark:text-gray-100">Jobs by Source</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[250px] sm:h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={jobsBySource}>
                                                        <XAxis dataKey="source" stroke="#888888" />
                                                        <YAxis stroke="#888888" />
                                                        <Tooltip />
                                                        <Bar dataKey="jobs" fill="#3B82F6" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* Upcoming Deadlines and Interviews */}
                            <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-gray-800 dark:text-gray-100">Upcoming Deadlines & Interviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Upcoming Deadlines */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Deadlines (Next 7 Days)</h3>
                                            {upcoming.deadlines.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="text-gray-600 dark:text-gray-300">Company</TableHead>
                                                                <TableHead className="text-gray-600 dark:text-gray-300">Position</TableHead>
                                                                <TableHead className="text-gray-600 dark:text-gray-300">Deadline</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {upcoming.deadlines.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell className="text-gray-800 dark:text-gray-100">{item.company}</TableCell>
                                                                    <TableCell className="text-gray-800 dark:text-gray-100">{item.position}</TableCell>
                                                                    <TableCell className="text-gray-800 dark:text-gray-100">
                                                                        <Badge variant="destructive">{new Date(item.deadline!).toLocaleDateString()}</Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-400">No upcoming deadlines.</p>
                                            )}
                                        </div>

                                        {/* Upcoming Interviews */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Interviews (Next 3 Days)</h3>
                                            {upcoming.interviews.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead className="text-gray-600 dark:text-gray-300">Company</TableHead>
                                                                <TableHead className="text-gray-600 dark:text-gray-300">Position</TableHead>
                                                                <TableHead className="text-gray-600 dark:text-gray-300">Interview Date</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {upcoming.interviews.map((item, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell className="text-gray-800 dark:text-gray-100">{item.company}</TableCell>
                                                                    <TableCell className="text-gray-800 dark:text-gray-100">{item.position}</TableCell>
                                                                    <TableCell className="text-gray-800 dark:text-gray-100">
                                                                        <Badge variant="default">{new Date(item.interviewDate!).toLocaleDateString()}</Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-400">No upcoming interviews.</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardPage;