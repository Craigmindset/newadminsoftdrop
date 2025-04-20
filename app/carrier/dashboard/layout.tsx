"use client"

import type React from "react"

import { CarrierSidebar } from "@/components/carrier-sidebar"
import { CarrierHeader } from "@/components/carrier-header"
import { useAuthProtection } from "@/hooks/use-auth-protection"

export default function CarrierDashboardLayout({
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
      <CarrierHeader />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <CarrierSidebar />
        </div>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
