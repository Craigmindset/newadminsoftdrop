import type { ReactNode } from "react"
import { CarrierSidebar } from "@/components/carrier-sidebar"
import { CarrierHeader } from "@/components/carrier-header"
import { Toaster } from "@/components/ui/toaster"

export default function CarrierDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CarrierHeader />
      <div className="flex flex-1">
        {/* Hide sidebar on mobile, show on md and up */}
        <div className="hidden md:block">
          <CarrierSidebar />
        </div>
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
