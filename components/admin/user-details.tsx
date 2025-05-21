"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface UserDetailsProps {
  id: string
  userType: string
}

export function UserDetails({ id, userType }: UserDetailsProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}?type=${userType}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setUser(data)
      } catch (err) {
        console.error("Error fetching user details:", err)
        setError("Failed to load user details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [id, userType])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    )
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-red-500">{error || "User not found"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500">
              {user.full_name?.charAt(0) || "U"}
            </div>
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
  )
}
