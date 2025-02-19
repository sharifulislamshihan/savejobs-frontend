"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const DashboardPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    console.log("user checking in dashboard", user);
    if (!user) {
        return <p>Redirecting...</p>;
    }

    return <h3>hello dashboard</h3>
};

export default DashboardPage;
