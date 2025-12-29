"use client"

import useAdmin from "@/hooks/useAdmin";
import { createContext, useContext } from "react";
import { useAuthProvider } from "./AuthContext";

interface AdminContext {
    dashboard: any;
    senders: any;
    carriers: any;
    transactions: any;
    error: string;
    adminLoading: boolean;
    getSingleUser: (userId: string) => Promise<{success: true, data: any} | any>
    getSenders: (page: number, limit: number) => void;
    getCarriers: (page: number, limit: number) => void;
    getTransactions: (page: number, limit: number) => void;
    toggleGuarantorOrVehicleDetails: (id: string, vehicleType: string, body: any) => void;
}

const AdminContext = createContext<AdminContext | null>(null)

export function AdminProvider({children}: any){
    let authProvider = useAuthProvider()
    let adminValues = useAdmin(authProvider?.accessToken!, authProvider?.refreshAuth!, authProvider?.logout!)
    return(
        <AdminContext.Provider value={adminValues}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdminProvider(){
    return useContext(AdminContext)
}