"use client"

import { useEffect, useMemo, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuthProvider } from "@/contexts/AuthContext"
import { ROLE_PERMISSIONS } from "@/constants/rbac"

type AdminProfileRow = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: "super_admin" | "manager" | "support" | "finance" | "marketing" | null
  is_active: boolean | null
  last_login: string | null
  created_at: string | null
}

function formatRole(role: AdminProfileRow["role"]) {
  if (!role) return "Unknown"
  if (role === "support") return "Support Agent"
  return role.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

function getDisplayName(admin: AdminProfileRow) {
  const firstName = (admin.first_name || "").trim()
  const lastName = (admin.last_name || "").trim()
  const fullName = `${firstName} ${lastName}`.trim()
  if (fullName) {
    return fullName
  }

  return admin.email
}

export default function AdminRoles() {
  const { toast } = useToast()
  const auth = useAuthProvider()
  const isSuperAdmin = auth?.role === "super_admin"
  const accessToken = auth?.accessToken || ""
  const [admins, setAdmins] = useState<AdminProfileRow[]>([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    role: "manager",
  })

  const canFetchAdmins = useMemo(() => Boolean(accessToken), [accessToken])

  useEffect(() => {
    async function fetchAdmins() {
      if (!canFetchAdmins) {
        setAdmins([])
        return
      }

      try {
        setIsLoadingAdmins(true)
        const response = await fetch("/api/admin/roles", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload?.error || "Unable to load admin users")
        }

        const payload = (await response.json()) as { admins?: AdminProfileRow[] }
        setAdmins(payload.admins || [])
      } catch (error: any) {
        setAdmins([])
        toast({
          title: "Unable to load admins",
          description: error?.message || "Please refresh and try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAdmins(false)
      }
    }

    void fetchAdmins()
  }, [accessToken, canFetchAdmins, toast])

  const handleAddAdmin = async () => {
    if (!newAdminData.email.trim() || !newAdminData.role) {
      toast({
        title: "Missing details",
        description: "Email and role are required.",
        variant: "destructive",
      })
      return
    }

    if (!accessToken) {
      toast({
        title: "Unauthorized",
        description: "Please sign in again.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsInviting(true)
      const response = await fetch("/api/admin/roles/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: newAdminData.email,
          role: newAdminData.role,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Unable to invite admin")
      }

      toast({
        title: "Invite sent",
        description: "The admin invite has been emailed.",
      })

      setNewAdminData({
        email: "",
        role: "manager",
      })
      setIsAddDialogOpen(false)
      try {
        const response = await fetch("/api/admin/roles", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (response.ok) {
          const payload = (await response.json()) as { admins?: AdminProfileRow[] }
          setAdmins(payload.admins || [])
        }
      } catch {
        // no-op
      }
    } catch (error: any) {
      toast({
        title: "Invite failed",
        description: error?.message || "Unable to invite admin",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleDeleteAdmin = async (admin: AdminProfileRow) => {
    if (!accessToken) {
      toast({
        title: "Unauthorized",
        description: "Please sign in again.",
        variant: "destructive",
      })
      return
    }

    const confirmed = window.confirm(
      `Delete ${admin.email}? This removes the user from authentication and admin profile data.`,
    )
    if (!confirmed) {
      return
    }

    try {
      setDeletingAdminId(admin.id)

      const response = await fetch(`/api/admin/roles/${admin.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Unable to delete admin user")
      }

      setAdmins((current) => current.filter((item) => item.id !== admin.id))
      toast({
        title: "Admin removed",
        description: "The user has been deleted from the database.",
      })
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.message || "Unable to delete admin user",
        variant: "destructive",
      })
    } finally {
      setDeletingAdminId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Roles</h1>
          <p className="text-gray-500">Manage admin users and their permissions</p>
        </div>
        {isSuperAdmin ? (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite Admin</DialogTitle>
              <DialogDescription>Send an invite email and assign a role</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <div className="col-span-3">
                  <Select
                    value={newAdminData.role}
                    onValueChange={(value) =>
                      setNewAdminData({ ...newAdminData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="support">Support Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin} disabled={isInviting}>
                {isInviting ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        ) : null}
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
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Permissions</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Last Active</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingAdmins ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      Loading admin users...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      No admin users found.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => {
                    const displayName = getDisplayName(admin)
                    const roleKey = admin.role || "support"
                    const permissions = ROLE_PERMISSIONS[roleKey]
                    return (
                  <tr key={admin.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${displayName.charAt(0)}`} />
                          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{displayName}</p>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatRole(admin.role)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          admin.is_active === false
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-green-200 bg-green-50 text-green-700"
                        }`}
                      >
                        {admin.is_active === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {permissions.includes("*") ? (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-black text-white">
                            Full Access
                          </span>
                        ) : (
                          permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            >
                              {permission.split(":")[0]}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">
                        {admin.last_login
                          ? new Date(admin.last_login).toLocaleString()
                          : "Never"}
                      </p>
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
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => void handleDeleteAdmin(admin)}
                            disabled={deletingAdminId === admin.id}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            {deletingAdminId === admin.id ? "Removing..." : "Remove"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
