import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { redirect } from "next/navigation"
import { ProfileProvider } from "@/context/profile-context"

// Create a separate client component for the Toaster
import { ClientToaster } from "@/components/client-toaster"
import { getSenderProfile } from "@/app/actions/update-profile"
import { checkSenderSession } from "@/app/actions/sender-auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if the user is authenticated
  const session = await checkSenderSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch the user's profile data
  const profile = await getSenderProfile()

  return (
    <ProfileProvider initialProfile={profile}>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          {/* Hide sidebar on mobile, show on md and up */}
          <div className="hidden md:block">
            <DashboardSidebar />
          </div>
          <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">{children}</main>
        </div>
        <ClientToaster />
      </div>
    </ProfileProvider>
  )
}
