"use client"

import { useEffect, useState } from "react"
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

type NotificationRow = {
  id: string
  title: string
  message: string
  target: "all" | "senders" | "carriers"
  priority: "high" | "medium" | "low"
  created_at: string
  sent_count: number
  failed_count: number
}

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
  const [isSending, setIsSending] = useState(false)
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function loadHistory() {
      setHistoryLoading(true)
      const response = await fetch("/api/admin/notifications")
      if (!response.ok) {
        setHistoryLoading(false)
        return
      }

      const payload = await response.json()
      if (!active) {
        return
      }

      setNotifications(payload.data || [])
      setHistoryLoading(false)
    }

    loadHistory()

    return () => {
      active = false
    }
  }, [])

  // Filter notifications based on search query and filters
  const filteredNotifications = notifications
    .filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((notification) => (targetFilter === "all" ? true : notification.target === targetFilter))
    .filter((notification) => (priorityFilter === "all" ? true : notification.priority === priorityFilter))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSending(true)
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, target, priority }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Unable to send notification")
      }

      const payload = await response.json().catch(() => ({}))
      toast({
        title: "Notification Sent",
        description: `Sent ${payload?.sent ?? 0} notification(s).`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Unable to send notification",
        variant: "destructive",
      })
      setIsSending(false)
      return
    }

    // Reset form
    setTitle("")
    setMessage("")
    setTarget("all")
    setPriority("medium")

    try {
      const historyResponse = await fetch("/api/admin/notifications")
      if (historyResponse.ok) {
        const historyPayload = await historyResponse.json()
        setNotifications(historyPayload.data || [])
      }
    } catch (error) {
      console.error("Failed to refresh notification history", error)
    }

    // Switch to history tab
    setActiveTab("history")
    setIsSending(false)
  }

  const handleReuseNotification = (notification: NotificationRow) => {
    setTitle(notification.title)
    setMessage(notification.message)
    setTarget(notification.target)
    setPriority(notification.priority)
    setActiveTab("create")
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
              <CardDescription>Send notifications to users with Expo push tokens</CardDescription>
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
                      <SelectItem value="all">All Users (Senders + Carriers)</SelectItem>
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
              <Button onClick={handleSendNotification} className="w-full" disabled={isSending}>
                {isSending ? "Sending..." : "Send Notification"}
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
                      <TableHead>Sent</TableHead>
                      <TableHead>Failed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Loading notification history...
                        </TableCell>
                      </TableRow>
                    ) : filteredNotifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
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
                          <TableCell className="hidden md:table-cell">{formatDate(notification.created_at)}</TableCell>
                          <TableCell>{notification.sent_count}</TableCell>
                          <TableCell>{notification.failed_count}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReuseNotification(notification)}
                            >
                              Reuse
                            </Button>
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
