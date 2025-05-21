import { UserManagement } from "@/components/admin/user-management"

export const metadata = {
  title: "User Management",
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-500">Manage all users of the platform</p>
      </div>
      <UserManagement />
    </div>
  )
}
