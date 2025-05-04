"use client"

import { Suspense } from "react"
import { UserManagement } from "@/components/admin/user-management"
import { Skeleton } from "@/components/ui/skeleton"

export default function UsersManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-500">Manage all users on the platform</p>
      </div>

      <Suspense fallback={<UserManagementSkeleton />}>
        <UserManagement />
      </Suspense>
    </div>
  )
}

function UserManagementSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className="h-10 w-[300px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}
