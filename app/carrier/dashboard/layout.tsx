import type { ReactNode } from "react"
import { CarrierSidebar } from "@/components/carrier-sidebar"
import { CarrierHeader } from "@/components/carrier-header"
import { checkCarrierSession } from "@/app/actions/carrier-auth"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

export default async function CarrierDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // Check if the carrier is authenticated
  const session = await checkCarrierSession()

  if (!session) {
    redirect("/login/carrier")
  }

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
