"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Toaster } from "@/components/ui/toaster"
import { useAuthProtection } from "@/hooks/use-auth-protection"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication before rendering dashboard
  const { isChecking } = useAuthProtection()

  // While checking auth status, show minimal loading UI that matches existing design
  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 border-b"></div> {/* Header placeholder */}
        <div className="flex flex-1">
          <div className="hidden md:block w-64"></div> {/* Sidebar placeholder */}
          <main className="flex-1 p-4 md:p-6 w-full flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
          </main>
        </div>
      </div>
    )
  }

  // Auth check passed, render the actual dashboard
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        {/* Hide sidebar on mobile, show on md and up */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
