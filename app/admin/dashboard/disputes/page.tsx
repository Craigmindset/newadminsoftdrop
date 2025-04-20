"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, Clock, Download, Eye, Filter, Search, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock dispute data
const mockDisputes = [
  {
    id: "DSP-1001",
    transactionId: "TRX-12345",
    date: "2023-09-15T14:30:00",
    status: "pending",
    priority: "high",
    type: "delivery-issue",
    reason: "Item not delivered",
    description: "The carrier marked the item as delivered, but I never received it.",
    amount: 2500,
    sender: {
      id: "SND-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    carrier: {
      id: "CAR-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+234 803 987 6543",
      avatar: null,
    },
    receiver: {
      id: "RCV-001",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+234 705 123 4567",
      avatar: null,
    },
    hasEvidence: true,
    assignedTo: "Admin User",
    lastUpdated: "2023-09-16T10:15:00",
  },
  {
    id: "DSP-1002",
    transactionId: "TRX-12346",
    date: "2023-09-14T11:20:00",
    status: "in-review",
    priority: "medium",
    type: "damaged-item",
    reason: "Item damaged during transit",
    description: "The package was delivered but the contents were damaged. I have attached photos as evidence.",
    amount: 3500,
    sender: {
      id: "SND-002",
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    carrier: {
      id: "CAR-002",
      name: "David Clark",
      email: "david@example.com",
      phone: "+234 803 987 6543",
      avatar: null,
    },
    receiver: {
      id: "RCV-002",
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    hasEvidence: true,
    assignedTo: "Support Team",
    lastUpdated: "2023-09-15T09:30:00",
  },
  {
    id: "DSP-1003",
    transactionId: "TRX-12347",
    date: "2023-09-13T16:45:00",
    status: "resolved",
    resolution: "refunded",
    priority: "low",
    type: "wrong-item",
    reason: "Received wrong item",
    description: "I received a different item than what I was expecting.",
    amount: 1800,
    sender: {
      id: "SND-003",
      name: "Robert Smith",
      email: "robert@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    carrier: {
      id: "CAR-003",
      name: "Jessica Lee",
      email: "jessica@example.com",
      phone: "+234 803 987 6543",
      avatar: null,
    },
    receiver: {
      id: "RCV-003",
      name: "Robert Smith",
      email: "robert@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    hasEvidence: false,
    assignedTo: "Admin User",
    lastUpdated: "2023-09-14T14:20:00",
    resolvedDate: "2023-09-14T14:20:00",
    resolvedBy: "Admin User",
  },
  {
    id: "DSP-1004",
    transactionId: "TRX-12348",
    date: "2023-09-12T09:15:00",
    status: "resolved",
    resolution: "denied",
    priority: "medium",
    type: "delivery-issue",
    reason: "Delivery delay",
    description: "My package was delivered 2 days later than the promised delivery date.",
    amount: 4200,
    sender: {
      id: "SND-004",
      name: "Amanda Wilson",
      email: "amanda@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    carrier: {
      id: "CAR-004",
      name: "Daniel Johnson",
      email: "daniel@example.com",
      phone: "+234 803 987 6543",
      avatar: null,
    },
    receiver: {
      id: "RCV-004",
      name: "Amanda Wilson",
      email: "amanda@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    hasEvidence: false,
    assignedTo: "Support Team",
    lastUpdated: "2023-09-13T11:30:00",
    resolvedDate: "2023-09-13T11:30:00",
    resolvedBy: "Support Team",
  },
  {
    id: "DSP-1005",
    transactionId: "TRX-12349",
    date: "2023-09-11T13:40:00",
    status: "pending",
    priority: "high",
    type: "payment-issue",
    reason: "Overcharged for delivery",
    description: "I was charged more than the quoted price for the delivery.",
    amount: 2200,
    sender: {
      id: "SND-005",
      name: "Jennifer Adams",
      email: "jennifer@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    carrier: {
      id: "CAR-005",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+234 803 987 6543",
      avatar: null,
    },
    receiver: {
      id: "RCV-005",
      name: "Jennifer Adams",
      email: "jennifer@example.com",
      phone: "+234 812 345 6789",
      avatar: null,
    },
    hasEvidence: true,
    assignedTo: null,
    lastUpdated: "2023-09-11T13:40:00",
  },
]

export default function DisputesPage() {
  const router = useRouter()
  const [disputeStatus, setDisputeStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter disputes based on filters
  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesStatus = disputeStatus === "all" || dispute.status === disputeStatus
    const matchesPriority = priorityFilter === "all" || dispute.priority === priorityFilter
    const matchesType = typeFilter === "all" || dispute.type === typeFilter
    const matchesSearch =
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dispute.reason && dispute.reason.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesStatus && matchesPriority && matchesType && matchesSearch
  })

  // Calculate metrics
  const totalDisputes = mockDisputes.length
  const pendingDisputes = mockDisputes.filter((d) => d.status === "pending").length
  const inReviewDisputes = mockDisputes.filter((d) => d.status === "in-review").length
  const resolvedDisputes = mockDisputes.filter((d) => d.status === "resolved").length
  const highPriorityDisputes = mockDisputes.filter((d) => d.priority === "high").length

  const handleViewDispute = (id: string) => {
    router.push(`/admin/dashboard/disputes/${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dispute Management</h1>
        <p className="text-gray-500">Manage and resolve disputes between senders, carriers, and receivers</p>
      </div>

      {/* Dispute Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
            <ShieldAlert className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisputes}</div>
            <p className="text-xs text-gray-500">
              {resolvedDisputes} resolved, {pendingDisputes + inReviewDisputes} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDisputes}</div>
            <p className="text-xs text-gray-500">{highPriorityDisputes} high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inReviewDisputes}</div>
            <p className="text-xs text-gray-500">Being processed by support team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedDisputes}</div>
            <p className="text-xs text-gray-500">
              {mockDisputes.filter((d) => d.status === "resolved" && d.resolution === "refunded").length} refunded,{" "}
              {mockDisputes.filter((d) => d.status === "resolved" && d.resolution === "denied").length} denied
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Tabs defaultValue="all" className="w-[300px]" onValueChange={setDisputeStatus}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Disputes</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search disputes..."
              className="w-full md:w-[200px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Dispute Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="delivery-issue">Delivery Issue</SelectItem>
              <SelectItem value="damaged-item">Damaged Item</SelectItem>
              <SelectItem value="wrong-item">Wrong Item</SelectItem>
              <SelectItem value="payment-issue">Payment Issue</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Disputes Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Dispute Cases</CardTitle>
          <CardDescription>{filteredDisputes.length} disputes found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-sm">Dispute ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Transaction</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Sender</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Carrier</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Priority</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisputes.map((dispute) => (
                  <tr key={dispute.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <span className="font-medium">{dispute.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{new Date(dispute.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{dispute.transactionId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              dispute.sender.avatar ||
                              `/placeholder.svg?height=24&width=24&text=${dispute.sender.name.charAt(0)}`
                            }
                          />
                          <AvatarFallback>{dispute.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{dispute.sender.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              dispute.carrier.avatar ||
                              `/placeholder.svg?height=24&width=24&text=${dispute.carrier.name.charAt(0)}`
                            }
                          />
                          <AvatarFallback>{dispute.carrier.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{dispute.carrier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{dispute.reason}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          dispute.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : dispute.status === "in-review"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {dispute.status === "resolved"
                          ? `Resolved (${dispute.resolution})`
                          : dispute.status
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          dispute.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : dispute.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleViewDispute(dispute.id)}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
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
