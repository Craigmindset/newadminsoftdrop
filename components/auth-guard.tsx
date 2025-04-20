"use client"

import { useAuthCheck } from "@/lib/auth-client"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/",
  "/signup/options",
  "/signup/sender",
  "/signup/carrier",
  "/forgot-password",
]

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthCheck()
  const pathname = usePathname()

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // If it's a public path, render children without auth check
  if (isPublicPath) {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // This should not render as the useAuthCheck hook should redirect,
  // but we include it as a fallback
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authentication Required</h1>
        <p className="mt-2">Please log in to access this page.</p>
      </div>
    </div>
  )
}
