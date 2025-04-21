"use client"

import { useState, useEffect } from "react"

type Notification = {
  id: number
  title: string
  description: string
  variant?: "default" | "destructive"
}

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simulate fetching initial notifications and calculating unread count
    // In a real application, you would fetch this data from an API or database
    const initialNotifications = [] // Replace with actual initial notifications
    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.length)
  }, [])

  const addNotification = (notification: Omit<Notification, "id">) => {
    setNotifications((prev) => [{ id: Date.now(), ...notification }, ...prev])
    setUnreadCount((prev) => prev + 1)
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    setUnreadCount((prev) => prev - 1)
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    unreadCount,
  }
}

export default useNotifications
