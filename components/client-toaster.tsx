"use client"

import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

export function ClientToaster() {
  const pathname = usePathname()

  // Don't render Toaster on any dashboard pages
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/carrier/dashboard") ||
    pathname?.startsWith("/admin/dashboard")
  ) {
    return null
  }

  return <Toaster />
}

// Also export as default for backward compatibility
export default ClientToaster
