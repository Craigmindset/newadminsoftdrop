import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Toaster } from "@/components/ui/toaster"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
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
    </AuthGuard>
  )
}
