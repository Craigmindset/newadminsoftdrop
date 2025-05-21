import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserDetails } from "@/components/admin/user-details"

export const metadata = {
  title: "User Details",
}

export default function UserDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { type?: string }
}) {
  const { id } = params
  const userType = searchParams.type === "carrier" ? "carrier" : "sender"

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

      <UserDetails id={id} userType={userType} />
    </div>
  )
}
