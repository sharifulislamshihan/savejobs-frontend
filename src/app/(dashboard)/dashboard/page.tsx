"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, CheckCircle, Clock, FileText, XCircle } from "lucide-react"
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
} from "recharts"

const statCards = [
    { title: "Total Jobs", value: 150, icon: Briefcase, color: "text-blue-500" },
    { title: "Applied Jobs", value: 75, icon: FileText, color: "text-green-500" },
    { title: "Interviews Scheduled", value: 10, icon: Clock, color: "text-yellow-500" },
    { title: "Accepted Offers", value: 3, icon: CheckCircle, color: "text-purple-500" },
    { title: "Rejected Applications", value: 25, icon: XCircle, color: "text-red-500" },
]

const pieChartData = [
    { name: "Not Applied", value: 75, color: "#3B82F6" },
    { name: "Applied", value: 75, color: "#10B981" },
    { name: "Interview", value: 10, color: "#F59E0B" },
    { name: "Rejected", value: 25, color: "#EF4444" },
    { name: "Accepted", value: 3, color: "#8B5CF6" },
]

const lineChartData = [
    { month: "Jan", applications: 10 },
    { month: "Feb", applications: 15 },
    { month: "Mar", applications: 20 },
    { month: "Apr", applications: 25 },
    { month: "May", applications: 30 },
    { month: "Jun", applications: 35 },
]

const barChartData = [
    { source: "LinkedIn", jobs: 50 },
    { source: "Indeed", jobs: 30 },
    { source: "Glassdoor", jobs: 20 },
    { source: "Company Website", jobs: 15 },
    { source: "Referral", jobs: 10 },
]

const upcomingDeadlines = [
    { company: "TechCorp", position: "Frontend Developer", deadline: "2023-07-15" },
    { company: "DataSystems", position: "Data Analyst", deadline: "2023-07-18" },
    { company: "AI Solutions", position: "Machine Learning Engineer", deadline: "2023-07-20" },
]

export default function Page() {

    const [activeTab, setActiveTab] = useState("overview")

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1 w-12 h-12" size="lg"/>
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
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="space-y-8 mt-10">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>


                        {/* overview */}
                        <div className="grid gap-4 lg:gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {statCards.map((card) => (
                                <Card
                                    key={card.title}
                                    className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className=" text-md lg:text-3xl font-medium text-gray-600 dark:text-gray-300">{card.title}</CardTitle>
                                        <card.icon className={`h-8 w-8 ${card.color}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100">{card.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>


                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* tab */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3 rounded-lg p-1 mb-4 gap-3">
                                    <TabsTrigger value="overview" className={`rounded-md px-4 py-2 ${activeTab === "overview" ? "bg-slate-700 text-white" : "bg-blue-700 dark:bg-blue-900"
                                        }`}>
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="monthly" className={`rounded-md px-4 py-2 ${activeTab === "monthly" ? "bg-slate-700 text-white" : "bg-blue-700 dark:bg-blue-900"
                                        }`}>
                                        Monthly Trend
                                    </TabsTrigger>
                                    <TabsTrigger value="sources" className={`rounded-md px-4 py-2 ${activeTab === "sources" ? "bg-slate-700 text-white" : "bg-blue-700 dark:bg-blue-900"
                                        }`}>
                                        Job Sources
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview">
                                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-gray-800 dark:text-gray-100">Job Status Distribution</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={pieChartData}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        >
                                                            {pieChartData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
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
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={lineChartData}>
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
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={barChartData}>
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


                            {/* upcoming job deadline */}
                            <Card className="bg-white dark:bg-gray-800 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-gray-800 dark:text-gray-100">Upcoming Job Deadlines & Interviews</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b dark:border-gray-700">
                                                    <th className="text-left py-2 text-gray-600 dark:text-gray-300">Company</th>
                                                    <th className="text-left py-2 text-gray-600 dark:text-gray-300">Position</th>
                                                    <th className="text-left py-2 text-gray-600 dark:text-gray-300">Deadline</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upcomingDeadlines.map((item, index) => (
                                                    <tr key={index} className="border-b dark:border-gray-700">
                                                        <td className="py-2 text-gray-800 dark:text-gray-100">{item.company}</td>
                                                        <td className="py-2 text-gray-800 dark:text-gray-100">{item.position}</td>
                                                        <td className="py-2 text-gray-800 dark:text-gray-100">{item.deadline}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>



                        <Card className="bg-white dark:bg-gray-800 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-gray-800 dark:text-gray-100">Days Since Last Job Added</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400">3 days</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
