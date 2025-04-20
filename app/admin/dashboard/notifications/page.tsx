"use client"

import { useState } from "react"
import { Search, AlertTriangle, Info, CheckCircle2, Users, UserCircle, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample notification data - in a real app, this would come from an API
const sampleNotifications = [
  {
    id: 1,
    title: "System Maintenance",
    message: "The system will be down for maintenance on Sunday from 2 AM to 4 AM.",
    target: "all",
    priority: "high",
    createdAt: "2023-11-15T08:00:00Z",
    readCount: 850,
    totalRecipients: 1050,
  },
  {
    id: 2,
    title: "New Feature: Real-time Tracking",
    message: "We've added real-time tracking for all shipments. Check it out!",
    target: "all",
    priority: "medium",
    createdAt: "2023-11-10T10:30:00Z",
    readCount: 920,
    totalRecipients: 1050,
  },
  {
    id: 3,
    title: "Carrier Onboarding Update",
    message: "We've simplified the carrier onboarding process. New carriers can now be verified within 24 hours.",
    target: "carriers",
    priority: "medium",
    createdAt: "2023-11-05T14:15:00Z",
    readCount: 380,
    totalRecipients: 400,
  },
  {
    id: 4,
    title: "Holiday Schedule",
    message: "Please note our modified operating hours during the upcoming holiday season.",
    target: "all",
    priority: "low",
    createdAt: "2023-11-01T09:45:00Z",
    readCount: 780,
    totalRecipients: 1050,
  },
  {
    id: 5,
    title: "Sender Promotion: Free Shipping",
    message: "Use code FREESHIP for free shipping on your next 3 deliveries!",
    target: "senders",
    priority: "high",
    createdAt: "2023-10-28T11:20:00Z",
    readCount: 590,
    totalRecipients: 650,
  },
  {
    id: 6,
    title: "Carrier Incentive Program",
    message: "Complete 10 deliveries this week and earn a 5% bonus on all trips!",
    target: "carriers",
    priority: "high",
    createdAt: "2023-10-25T13:10:00Z",
    readCount: 350,
    totalRecipients: 400,
  },
  {
    id: 7,
    title: "App Update Available",
    message: "Version 2.5 is now available with improved performance and bug fixes.",
    target: "all",
    priority: "medium",
    createdAt: "2023-10-20T15:30:00Z",
    readCount: 920,
    totalRecipients: 1050,
  },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("create")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [target, setTarget] = useState("all")
  const [priority, setPriority] = useState("medium")
  const [searchQuery, setSearchQuery] = useState("")
  const [targetFilter, setTargetFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter notifications based on search query and filters
  const filteredNotifications = sampleNotifications
    .filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((notification) => (targetFilter === "all" ? true : notification.target === targetFilter))
    .filter((notification) => (priorityFilter === "all" ? true : notification.priority === priorityFilter))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleSendNotification = () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send the notification to an API
    toast({
      title: "Notification Sent",
      description: `Your notification has been sent to ${target === "all" ? "all users" : target}`,
    })

    // Reset form
    setTitle("")
    setMessage("")
    setTarget("all")
    setPriority("medium")

    // Switch to history tab
    setActiveTab("history")
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Info className="h-3 w-3" /> Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Low
          </Badge>
        )
      default:
        return null
    }
  }

  const getTargetIcon = (target) => {
    switch (target) {
      case "all":
        return <Users className="h-4 w-4" />
      case "senders":
        return <UserCircle className="h-4 w-4" />
      case "carriers":
        return <Truck className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notification Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
              <CardDescription>Send notifications to users based on their role and set priority levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Notification Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Notification Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="target" className="text-sm font-medium">
                    Target Audience
                  </label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="senders">Senders Only</SelectItem>
                      <SelectItem value="carriers">Carriers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority Level
                  </label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSendNotification} className="w-full">
                Send Notification
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View and manage all sent notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={targetFilter} onValueChange={setTargetFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Targets</SelectItem>
                      <SelectItem value="senders">Senders</SelectItem>
                      <SelectItem value="carriers">Carriers</SelectItem>
                    </SelectContent>
                  </Select>

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
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Target</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Read Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No notifications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-muted-foreground hidden md:block">
                                {notification.message.length > 60
                                  ? `${notification.message.substring(0, 60)}...`
                                  : notification.message}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              {getTargetIcon(notification.target)}
                              <span className="capitalize">{notification.target}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(notification.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${(notification.readCount / notification.totalRecipients) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {Math.round((notification.readCount / notification.totalRecipients) * 100)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
