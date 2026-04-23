"use client";

import type { Permission } from "@/constants/rbac";
import type { AdminProfile } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";
import { createContext, useContext } from "react";

interface AuthInterface {
  isLoggedIn: boolean | null;
  authLoading: boolean;
  accessToken: string | null;
  adminProfile: AdminProfile | null;
  role: AdminProfile["role"] | null;
  can: (permission: Permission) => boolean;
  refreshAuth: (token?: string) => Promise<string | null>;
  login: (
    body: { email: string; password: string },
    setError: (val: string) => void,
  ) => Promise<{ success: boolean } | any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthInterface | null>(null);

export function AuthProvider({ children }: any) {
  let authValues = useAuth();
  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
}

export function useAuthProvider() {
  return useContext(AuthContext);
}
