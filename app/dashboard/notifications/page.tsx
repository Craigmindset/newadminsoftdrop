"use client"

import useNotifications from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="container mx-auto py-6 px-4 sm:px-0">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">View all your notifications</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={notifications.length === 0}
              className="mt-2 sm:mt-0"
            >
              Mark All as Read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "border rounded-md p-3 flex flex-col sm:flex-row items-start justify-between",
                    notification.read ? "opacity-50" : "",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
