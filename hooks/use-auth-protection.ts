"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuthProtection() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Function to check authentication status
    const checkAuth = () => {
      try {
        // Check for session token in localStorage or cookies
        const hasSession =
          document.cookie.includes("sb-session") || localStorage.getItem("supabase.auth.token") !== null

        if (!hasSession) {
          // No session found, redirect to login
          console.log("No authentication detected, redirecting to login")
          router.replace("/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // On error, redirect to login as a safety measure
        router.replace("/login")
      } finally {
        setIsChecking(false)
      }
    }

    // Run the check
    checkAuth()
  }, [router])

  return { isChecking }
}
