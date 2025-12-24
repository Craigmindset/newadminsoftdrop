"use client"

import useAuth from "@/hooks/useAuth"
import { createContext, useContext } from "react"

interface AuthInterface {
    isLoggedIn: boolean | null;
    accessToken: string | null;
    refreshAuth: (token: string)=> void;
    login: (body: any, setError: (val: string)=>void)=> Promise<{success: boolean} | any>
    logout: ()=>void
}

const AuthContext = createContext<AuthInterface | null>(null)

export function AuthProvider({children}: any){
    let authValues = useAuth()
    return(
        <AuthContext.Provider value={authValues}>
            {
                children
            }
        </AuthContext.Provider>
    )
}

export function useAuthProvider(){
    return useContext(AuthContext)
}