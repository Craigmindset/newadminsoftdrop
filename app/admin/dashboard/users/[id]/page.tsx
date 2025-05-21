import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "User Details",
}

export default async function UserDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { type?: string }
}) {
  const { id } = params
  const userType = searchParams.type === "carrier" ? "carrier" : "sender"

  // Fetch user data from API instead of directly using Supabase
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/users/${id}?type=${userType}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    console.error("Error fetching user details:", await response.text())
    notFound()
  }

  const user = await response.json()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-gray-500">View detailed information about this user</p>
        </div>
        <Link href="/admin/dashboard/users">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.full_name || "Unknown User"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-gray-500">User Type</dt>
                  <dd>{userType === "carrier" ? "Carrier" : "Sender"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-gray-500">Full Name</dt>
                  <dd>{user.full_name || "N/A"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd>{user.email || user.auth_users?.email || "N/A"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-gray-500">Phone</dt>
                  <dd>{user.phone_number || "N/A"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="capitalize">{user.status || "pending"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-medium text-gray-500">Joined</dt>
                  <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {userType === "carrier" && (
              <div>
                <h3 className="text-lg font-medium mb-4">Carrier Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-gray-500">Vehicle Type</dt>
                    <dd>{user.vehicle_type || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-gray-500">License Number</dt>
                    <dd>{user.license_number || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-gray-500">KYC Status</dt>
                    <dd className="capitalize">{user.kyc_status || "pending"}</dd>
                  </div>
                </dl>
              </div>
            )}

            {userType === "sender" && (
              <div>
                <h3 className="text-lg font-medium mb-4">Sender Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-gray-500">Default Address</dt>
                    <dd>{user.default_address || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <dt className="font-medium text-gray-500">Preferred Payment Method</dt>
                    <dd className="capitalize">{user.preferred_payment_method || "N/A"}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
