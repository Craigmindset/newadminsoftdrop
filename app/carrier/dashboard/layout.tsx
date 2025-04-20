"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { CarrierSidebar } from "@/components/carrier-sidebar"
import { CarrierHeader } from "@/components/carrier-header"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

export default function CarrierDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        // Check for session cookie with the specific name format
        const hasCookie = document.cookie.split(";").some((item) => item.trim().startsWith("sb-session="))

        if (!hasCookie) {
          console.log("No authentication detected, redirecting to login")
          router.replace("/login/carrier")
          return
        }

        // User is authenticated
        setIsChecking(false)
      } catch (error) {
        console.error("Auth check error:", error)
        // On error, still show dashboard to avoid blocking legitimate users
        setIsChecking(false)
      }
    }

    // Small delay to ensure cookies are loaded
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

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
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
