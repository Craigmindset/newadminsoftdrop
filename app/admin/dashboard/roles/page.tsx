"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash, User, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for demonstration
const mockAdmins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "Super Admin",
    permissions: ["all"],
    lastActive: "2023-09-15T14:30:00",
  },
  {
    id: 2,
    name: "Marketing Manager",
    email: "marketing@example.com",
    role: "Marketing",
    permissions: ["users.view", "notifications.manage", "analytics.view"],
    lastActive: "2023-09-14T09:45:00",
  },
  {
    id: 3,
    name: "Finance Officer",
    email: "finance@example.com",
    role: "Finance",
    permissions: ["transactions.view", "transactions.manage", "analytics.view"],
    lastActive: "2023-09-15T11:20:00",
  },
  {
    id: 4,
    name: "Customer Support",
    email: "support@example.com",
    role: "Customer Care",
    permissions: ["users.view", "disputes.manage", "notifications.manage"],
    lastActive: "2023-09-15T13:10:00",
  },
]

const availablePermissions = [
  { id: "users.view", label: "View Users" },
  { id: "users.manage", label: "Manage Users" },
  { id: "transactions.view", label: "View Transactions" },
  { id: "transactions.manage", label: "Manage Transactions" },
  { id: "disputes.view", label: "View Disputes" },
  { id: "disputes.manage", label: "Manage Disputes" },
  { id: "notifications.manage", label: "Manage Notifications" },
  { id: "analytics.view", label: "View Analytics" },
  { id: "roles.manage", label: "Manage Admin Roles" },
]

export default function AdminRoles() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: [] as string[],
  })

  const handlePermissionChange = (permissionId: string) => {
    setNewAdminData((prev) => {
      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId]

      return { ...prev, permissions }
    })
  }

  const handleAddAdmin = () => {
    // In a real app, you would send this data to your backend
    console.log("Adding new admin:", newAdminData)

    // Reset form and close dialog
    setNewAdminData({
      name: "",
      email: "",
      role: "",
      permissions: [],
    })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Roles</h1>
          <p className="text-gray-500">Manage admin users and their permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>Create a new admin user with specific role and permissions</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData({ ...newAdminData, role: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g. Marketing, Finance, Customer Care"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={newAdminData.permissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionChange(permission.id)}
                      />
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>Add Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>Manage admin users and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-sm">Admin</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Permissions</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Last Active</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${admin.name.charAt(0)}`} />
                          <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{admin.role}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.includes("all") ? (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-black text-white">
                            Full Access
                          </span>
                        ) : (
                          admin.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            >
                              {permission.split(".")[0]}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{new Date(admin.lastActive).toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
