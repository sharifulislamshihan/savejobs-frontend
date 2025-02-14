export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen w-full bg-white dark:bg-gray-900">
            <main className="h-screen w-full overflow-auto">
                {children}
            </main>
        </div>
    );
}