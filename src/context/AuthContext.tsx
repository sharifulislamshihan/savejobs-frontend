"use client";

import Loading from "@/components/loading";
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import { getCookie } from "cookies-next";
import { createContext, useEffect, useState, ReactNode } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkUser = async () => {
            const token = getCookie("accessToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.success) {
                    setUser(response.data.data);
                } else {
                    setUser(null); // Clear user if /auth/me fails
                }
            } catch (error) {
                console.error("Error checking user:", error);
                setUser(null); // Clear user on error
            } finally {
                setLoading(false); // Set loading to false after check
            }
        };

        checkUser();
    }, []);

    // Show a loading state while checking user
    if (loading) {
        return <Loading/>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};