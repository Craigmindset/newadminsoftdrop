"use client"

import type React from "react"

import { useState, useCallback } from "react"

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

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toasts>([])

  const toast = useCallback((props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((t: Toasts) => [...t, { id, ...props }])
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((t: Toasts) => t.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  }
}
