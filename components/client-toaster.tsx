"use client"

import { usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

export function ClientToaster() {
  const pathname = usePathname()

  // Don't render Toaster on any dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  return <Toaster />
}
