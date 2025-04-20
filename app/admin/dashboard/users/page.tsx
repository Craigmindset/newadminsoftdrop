"use client"

import { useState } from "react"
import { Filter, MoreHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Function to generate random Nigerian users
function generateRandomUsers(count) {
  // Nigerian first names
  const firstNames = [
    "Adebayo",
    "Chioma",
    "Oluwaseun",
    "Ngozi",
    "Emeka",
    "Folake",
    "Chinedu",
    "Yewande",
    "Olumide",
    "Amara",
    "Tunde",
    "Nneka",
    "Obinna",
    "Funmilayo",
    "Ikechukwu",
    "Aisha",
    "Olamide",
    "Zainab",
    "Segun",
    "Fatima",
    "Chidi",
    "Bisi",
    "Uche",
    "Jumoke",
    "Adeola",
    "Chinwe",
    "Kayode",
    "Halima",
    "Oluwafemi",
    "Chiamaka",
    "Babatunde",
    "Adaeze",
    "Damilola",
    "Ifeoma",
    "Rotimi",
    "Yetunde",
    "Nnamdi",
    "Omolara",
    "Femi",
    "Blessing",
    "Tochukwu",
    "Temitope",
    "Oluwatobi",
    "Chinyere",
    "Gbenga",
    "Amina",
    "Kelechi",
    "Titilayo",
    "Oluwadamilare",
    "Ebere",
  ]

  // Nigerian last names
  const lastNames = [
    "Adeyemi",
    "Okonkwo",
    "Okafor",
    "Ibrahim",
    "Eze",
    "Adebisi",
    "Nwachukwu",
    "Ogunleye",
    "Okoro",
    "Abubakar",
    "Nwosu",
    "Adekunle",
    "Chukwu",
    "Afolabi",
    "Nwankwo",
    "Oladipo",
    "Uzoma",
    "Adeleke",
    "Musa",
    "Olawale",
    "Amadi",
    "Yusuf",
    "Nduka",
    "Adesina",
    "Obiora",
    "Olanrewaju",
    "Usman",
    "Okoye",
    "Mohammed",
    "Adegoke",
    "Suleiman",
    "Onyeka",
    "Adeniyi",
    "Igwe",
    "Bello",
    "Olaleye",
    "Onuoha",
    "Adeoye",
    "Aliyu",
    "Obasanjo",
    "Nnamani",
    "Oyelade",
    "Danjuma",
    "Ayodele",
    "Chukwuka",
    "Olukoya",
    "Yakubu",
    "Osagie",
    "Obi",
    "Lawal",
  ]

  // Email domains
  const emailDomains = ["gmail.com", "yahoo.com", "hotmail.com"]

  // Generate random date between Jan 2025 and first week of April 2025
  function randomDate() {
    const start = new Date("2025-01-01")
    const end = new Date("2025-04-07") // First week of April
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  // Generate random Nigerian phone number
  function randomPhone() {
    const prefixes = [
      "703",
      "705",
      "706",
      "708",
      "802",
      "803",
      "805",
      "806",
      "807",
      "808",
      "809",
      "810",
      "811",
      "812",
      "813",
      "814",
      "815",
      "816",
      "817",
      "818",
      "819",
      "909",
      "908",
      "901",
      "902",
      "903",
      "904",
      "905",
      "906",
      "907",
    ]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, "0")
    return `+234 ${prefix} ${suffix.substring(0, 3)} ${suffix.substring(3)}`
  }

  // Generate users
  const users = []
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`

    // Random email domain
    const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${emailDomain}`

    // Adjust type distribution to match dashboard stats (292 carriers, 168 senders)
    const type = Math.random() < 292 / 460 ? "carrier" : "sender"

    // For carriers, ensure 280 out of 292 are active
    let status
    if (type === "carrier") {
      status = Math.random() < 280 / 292 ? "active" : Math.random() > 0.5 ? "inactive" : "pending"
    } else {
      status = Math.random() > 0.3 ? "active" : Math.random() > 0.5 ? "inactive" : "pending"
    }

    const joinDate = randomDate()
    const transactions =
      status === "active" ? Math.floor(Math.random() * 100) : status === "inactive" ? Math.floor(Math.random() * 20) : 0

    users.push({
      id: i,
      name,
      email,
      phone: randomPhone(),
      type,
      status,
      joinDate: joinDate.toISOString().split("T")[0],
      transactions,
    })
  }

  return users
}

// Generate 460 random Nigerian users
const mockUsers = generateRandomUsers(460)

export default function UsersManagement() {
  const [userType, setUserType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  // Filter users based on type and search query
  const filteredUsers = mockUsers.filter((user) => {
    const matchesType = userType === "all" || user.type === userType
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    return matchesType && matchesSearch
  })

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-500">Manage all users on the platform</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="all" className="w-[300px]" onValueChange={setUserType}>
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
            {filteredUsers.length} users found (showing {indexOfFirstUser + 1}-
            {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${user.name.charAt(0)}`} />
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-500">Activate</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
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
        </CardContent>
      </Card>
    </div>
  )
}
