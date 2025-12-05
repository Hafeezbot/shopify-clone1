"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface Admin
{
    id: string;
    username: string;
}

interface AdminContextType
{
    admin: Admin | null;
    setAdmin: (admin: Admin | null) => void;
    isLoading: boolean;
}

const AdminContext = createContext<AdminContextType>({
    admin: null,
    setAdmin: () => { },
    isLoading: true,
});

export function AdminSessionProvider({ children }: { children: React.ReactNode })
{
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>
    {
        // Check for admin session on mount
        fetch("/api/admin-session")
            .then((res) => res.json())
            .then((data) =>
            {
                if (data.admin)
                {
                    setAdmin(data.admin);
                }
            })
            .catch((error) =>
            {
                console.error("Admin session check failed:", error);
            })
            .finally(() =>
            {
                setIsLoading(false);
            });
    }, []);

    return (
        <AdminContext.Provider value={{ admin, setAdmin, isLoading }}>
            {children}
        </AdminContext.Provider>
    );
}

// Custom hook to use admin session
export const useAdmin = () => useContext(AdminContext);
