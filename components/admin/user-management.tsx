"use client"

import { useState, useEffect } from "react"
import { Filter, MoreHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import type { UserProfile } from "@/lib/user-management"

export function UserManagement() {
  const [userType, setUserType] = useState<"all" | "sender" | "carrier">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<UserProfile[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const { toast } = useToast()

  const usersPerPage = 10

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch users when filters change
  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/admin/users?type=${userType}&page=${currentPage}&limit=${usersPerPage}&search=${encodeURIComponent(
            debouncedSearchQuery,
          )}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data.users)
        setTotalCount(data.totalCount)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userType, currentPage, debouncedSearchQuery, toast])

  const totalPages = Math.ceil(totalCount / usersPerPage)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleUpdateStatus = async (userId: string, userType: "sender" | "carrier", newStatus: string) => {
    try {
      const response = await fetch("/api/admin/users/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userType,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus as "active" | "inactive" | "pending" } : user,
        ),
      )

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs
          defaultValue={userType}
          className="w-[300px]"
          onValueChange={(value) => {
            setUserType(value as "all" | "sender" | "carrier")
            setCurrentPage(1)
          }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="sender">Senders</TabsTrigger>
            <TabsTrigger value="carrier">Carriers</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full sm:w-[300px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {totalCount} users found
            {users.length > 0 && (
              <>
                {" "}
                (showing {(currentPage - 1) * usersPerPage + 1}-{Math.min(currentPage * usersPerPage, totalCount)} of{" "}
                {totalCount})
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
              {debouncedSearchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Transactions</th>
                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder-icon.png?height=32&width=32&text=${user.name.charAt(0)}`}
                            />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{user.phone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.type === "carrier" ? "outline" : "secondary"}>
                          {user.type === "carrier" ? "Carrier" : "Sender"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
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
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{user.transactions}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/admin/dashboard/users/${user.id}?type=${user.type}`)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/admin/dashboard/users/edit/${user.id}?type=${user.type}`)
                              }
                            >
                              Edit User
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleUpdateStatus(user.id, user.type, "inactive")}
                              >
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-500"
                                onClick={() => handleUpdateStatus(user.id, user.type, "active")}
                              >
                                Activate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && users.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, totalCount)} of{" "}
                {totalCount} users
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageToShow
                    if (totalPages <= 5) {
                      pageToShow = i + 1
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i
                    } else {
                      pageToShow = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageToShow}
                        variant={currentPage === pageToShow ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8"
                        onClick={() => paginate(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="mx-1">...</span>
                      <Button variant="outline" size="sm" className="w-8 h-8" onClick={() => paginate(totalPages)}>
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
