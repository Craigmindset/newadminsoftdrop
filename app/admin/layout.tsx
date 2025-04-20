import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Logistics Platform",
  description: "Super admin dashboard for managing the logistics platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
      <Toaster />
    </div>
  )
}
