import { getUserDetails } from "@/lib/user-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function UserDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { type: string }
}) {
  const { id } = params
  const userType = searchParams.type as "sender" | "carrier"

  if (!userType || (userType !== "sender" && userType !== "carrier")) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Invalid user type specified</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const user = await getUserDetails(id, userType)

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">User not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/dashboard/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    user.profile_image_url ||
                    `/placeholder.svg?height=96&width=96&text=${user.full_name?.charAt(0) || "U"}`
                  }
                  alt={user.full_name || "User"}
                />
                <AvatarFallback className="text-2xl">{user.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.full_name || "Unknown"}</h3>
                <p className="text-gray-500">{user.email || user.auth_users?.email || "No email"}</p>
              </div>
              <Badge variant={userType === "carrier" ? "outline" : "secondary"} className="capitalize">
                {userType}
              </Badge>
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    user.status === "active"
                      ? "bg-green-500"
                      : user.status === "inactive"
                        ? "bg-gray-400"
                        : "bg-yellow-500"
                  }`}
                ></span>
                <span className="capitalize">{user.status || "pending"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p>{user.full_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user.email || user.auth_users?.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{user.phone_number || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p>{user.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Joined</p>
                  <p>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              {userType === "carrier" && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Carrier Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                      <p>{user.vehicle_type || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vehicle Registration</p>
                      <p>{user.vehicle_registration || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">License Number</p>
                      <p>{user.license_number || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">KYC Verified</p>
                      <p>{user.kyc_verified ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
