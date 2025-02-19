"use client";

import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                    localStorage.removeItem("accessToken");
                }
            } catch (error) {
                console.error("Error checking user:", error);
                setUser(null);
                localStorage.removeItem("accessToken");
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
