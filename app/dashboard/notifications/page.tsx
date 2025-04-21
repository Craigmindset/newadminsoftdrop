"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import useNotifications from "@/hooks/use-notifications"

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View all your notifications</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.length === 0}>
              Mark All as Read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="border rounded-md p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)}>
                    <span className="sr-only">Mark as Read</span>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeNotification(notification.id)}>
                    <span className="sr-only">Dismiss</span>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
