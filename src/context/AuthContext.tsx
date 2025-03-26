"use client";

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

    useEffect(() => {
        const checkUser = async () => {
            const token = getCookie("accessToken");

            //console.log("Token from auth context", token);

            if (!token) {
                return;
            }

            try {
                const response = await axios.get(`${baseUrl}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                //console.log("Response from auth context", response.data.data);


                if (response.data.success) {
                    setUser(response.data.data);
                    //console.log("User from auth context response", response.data.user);

                }
            } catch (error) {
                console.error("Error checking user:", error);
            }
        };
        //console.log("Checking user from auth context", user);

        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
