"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuthProtection() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Function to check authentication status
    const checkAuth = async () => {
      try {
        // More robust session check that looks for the specific session cookie format
        const hasCookie = document.cookie.split(";").some((item) => item.trim().startsWith("sb-session="))

        // Check localStorage as fallback (if your app uses it)
        const hasLocalStorage =
          typeof window !== "undefined" &&
          (localStorage.getItem("sb-auth-token") || localStorage.getItem("supabase.auth.token"))

        // If we have either authentication method, consider the user logged in
        if (hasCookie || hasLocalStorage) {
          console.log("Authentication detected, allowing access to dashboard")
          setIsChecking(false)
          return
        }

        // No valid auth found, redirect to login
        console.log("No authentication detected, redirecting to login")
        router.replace("/login")
      } catch (error) {
        console.error("Auth check error:", error)
        // On error, we'll still render the dashboard to avoid blocking legitimate users
        setIsChecking(false)
      }
    }

    // Add a small delay to ensure cookies are properly loaded
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return { isChecking }
}
