"use client"

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { SiteFooter } from "@/components/site-footer"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login" || pathname === "/login/carrier"
  const isAdminDashboard = pathname?.startsWith("/admin/dashboard")
  const isSenderDashboard = pathname?.startsWith("/dashboard")
  const isCarrierDashboard = pathname?.startsWith("/carrier/dashboard")

  // Don't show footer on login pages, admin dashboard, sender dashboard, or carrier dashboard
  const showFooter = !isLoginPage && !isAdminDashboard && !isSenderDashboard && !isCarrierDashboard

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {showFooter && <SiteFooter />}
      </body>
    </html>
  )
}
