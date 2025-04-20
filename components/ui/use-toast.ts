"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type Toasts = ToastProps[]

interface UseToastReturn {
  toast: (props: Omit<ToastProps, "id">) => string
  dismiss: (id: string) => void
  dismissAll: () => void
  toasts: Toasts
}

// Create a singleton to store toast state across the app
const TOAST_STORE: {
  toasts: Toasts
  listeners: Set<(toasts: Toasts) => void>
  subscribe: (listener: (toasts: Toasts) => void) => () => void
  addToast: (props: Omit<ToastProps, "id">) => string
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
} = {
  toasts: [],
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  },

  addToast(props) {
    const id = Math.random().toString(36).substring(2, 9)
    this.toasts = [...this.toasts, { id, ...props }]
    this.listeners.forEach((listener) => listener(this.toasts))
    return id
  },

  dismissToast(id) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.listeners.forEach((listener) => listener(this.toasts))
  },

  dismissAllToasts() {
    this.toasts = []
    this.listeners.forEach((listener) => listener(this.toasts))
  },
}

// Export the direct toast function
export const toast = (props: Omit<ToastProps, "id">) => {
  return TOAST_STORE.addToast(props)
}

// Export the hook for component usage
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toasts>(TOAST_STORE.toasts)

  // Subscribe to toast store changes
  useEffect(() => {
    const unsubscribe = TOAST_STORE.subscribe(setToasts)
    return unsubscribe
  }, [])

  const toast = useCallback((props: Omit<ToastProps, "id">) => {
    return TOAST_STORE.addToast(props)
  }, [])

  const dismiss = useCallback((id: string) => {
    TOAST_STORE.dismissToast(id)
  }, [])

  const dismissAll = useCallback(() => {
    TOAST_STORE.dismissAllToasts()
  }, [])

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  }
}
