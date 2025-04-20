"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Check if we're on the client side
const isBrowser = typeof window !== "undefined"

// Function to check if user is logged in on client side
export function useAuthCheck() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check for session cookie
        const hasCookie = document.cookie.includes("sb-session")

        if (!hasCookie) {
          console.log("No session cookie found, redirecting to login")
          router.replace("/login")
          return
        }

        // Try to parse the cookie to verify it's valid
        try {
          const cookies = document.cookie.split(";")
          const sessionCookie = cookies.find((c) => c.trim().startsWith("sb-session="))

          if (sessionCookie) {
            const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]))

            // Check if session has required fields
            if (!sessionData.userId || !sessionData.sessionId) {
              console.log("Invalid session data, redirecting to login")
              router.replace("/login")
              return
            }

            // Session looks valid
            setIsAuthenticated(true)
          } else {
            // No session cookie found
            console.log("No valid session cookie found, redirecting to login")
            router.replace("/login")
          }
        } catch (error) {
          console.error("Error parsing session cookie:", error)
          router.replace("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  return { isLoading, isAuthenticated }
}
