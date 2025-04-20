"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Function to clean up the URL if it contains the variable name
function cleanupUrl(url: string | undefined): string | undefined {
  if (!url) return undefined

  // Check if the URL contains the variable name and extract the actual URL
  if (url.includes("NEXT_PUBLIC_SUPABASE_URL=")) {
    const match = url.match(/NEXT_PUBLIC_SUPABASE_URL=(https:\/\/.+)/)
    return match ? match[1] : url
  }

  return url
}

// Function to clean up the API key if it contains the variable name
function cleanupApiKey(key: string | undefined): string | undefined {
  if (!key) return undefined

  // Check if the key contains the variable name and extract the actual key
  if (key.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
    const match = key.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^=\s]+)/)
    return match ? match[1] : key
  }

  return key
}

export function SupabaseConfigChecker() {
  const [status, setStatus] = useState<{
    isValid: boolean
    message: string
    details?: string
    solution?: string
    example?: string
  } | null>(null)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        // Check if environment variables are set
        let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl) {
          setStatus({
            isValid: false,
            message: "Supabase URL is missing",
            solution: "Add NEXT_PUBLIC_SUPABASE_URL to your environment variables",
            example: "https://your-project.supabase.co",
          })
          return
        }

        // Check if the URL contains the variable name
        if (supabaseUrl.includes("NEXT_PUBLIC_SUPABASE_URL=")) {
          supabaseUrl = cleanupUrl(supabaseUrl) || supabaseUrl
          setStatus({
            isValid: false,
            message: "Supabase URL contains the variable name",
            details: supabaseUrl,
            solution:
              "Your environment variable appears to be incorrectly formatted. The value should be just the URL without the variable name.",
            example: "Correct format: https://your-project.supabase.co",
          })
          return
        }

        if (!supabaseUrl.startsWith("https://")) {
          setStatus({
            isValid: false,
            message: "Supabase URL must start with https://",
            details: supabaseUrl,
            solution: "Update your NEXT_PUBLIC_SUPABASE_URL to start with https://",
            example: "https://your-project.supabase.co",
          })
          return
        }

        try {
          new URL(supabaseUrl)
        } catch (error) {
          setStatus({
            isValid: false,
            message: "Supabase URL is not a valid URL",
            details: supabaseUrl,
            solution: "Check the format of your NEXT_PUBLIC_SUPABASE_URL environment variable",
            example: "https://your-project.supabase.co",
          })
          return
        }

        if (!supabaseKey) {
          setStatus({
            isValid: false,
            message: "Supabase API key is missing",
            solution: "Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          })
          return
        }

        // Check if the key contains the variable name
        if (supabaseKey.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
          supabaseKey = cleanupApiKey(supabaseKey) || supabaseKey
          setStatus({
            isValid: false,
            message: "Supabase API key contains the variable name",
            details: `${supabaseKey.substring(0, 10)}...`,
            solution:
              "Your environment variable appears to be incorrectly formatted. The value should be just the API key without the variable name.",
            example: "Correct format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          })
          return
        }

        // Check if the key starts with "ey" (JWT format)
        if (!supabaseKey.startsWith("ey")) {
          setStatus({
            isValid: false,
            message: "Supabase API key has an invalid format",
            details: `${supabaseKey.substring(0, 5)}...`,
            solution: "API key should start with 'ey'. Get the correct key from your Supabase dashboard.",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          })
          return
        }

        // Check key length
        if (supabaseKey.length < 30) {
          setStatus({
            isValid: false,
            message: "Supabase API key is too short",
            details: `Length: ${supabaseKey.length} chars`,
            solution:
              "API key should be at least 30 characters long. Get the correct key from your Supabase dashboard.",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          })
          return
        }

        // If we get here, basic validation passed
        setStatus({
          isValid: true,
          message: "Supabase configuration appears valid",
        })
      } catch (error) {
        setStatus({
          isValid: false,
          message: "Error checking Supabase configuration",
          details: error instanceof Error ? error.message : String(error),
          solution: "Check your environment variables and Supabase setup",
        })
      }
    }

    checkConfig()
  }, [])

  if (!status) {
    return null
  }

  return (
    <Alert
      variant={status.isValid ? "default" : "destructive"}
      className={status.isValid ? "bg-green-900 border-green-800" : "bg-red-900 border-red-800"}
    >
      {status.isValid ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertTitle>{status.isValid ? "Supabase Configuration Valid" : "Supabase Configuration Error"}</AlertTitle>
      <AlertDescription>
        <p>{status.message}</p>
        {status.details && (
          <p className="text-xs mt-1">
            Current value: <code className="bg-black/20 px-1 py-0.5 rounded">{status.details}</code>
          </p>
        )}
        {status.solution && <p className="text-sm mt-2 font-semibold">Solution: {status.solution}</p>}
        {status.example && (
          <p className="text-xs mt-1">
            Example: <code className="bg-black/20 px-1 py-0.5 rounded">{status.example}</code>
          </p>
        )}

        {!status.isValid && (
          <div className="mt-3">
            <Button size="sm" variant="outline" className="text-xs" asChild>
              <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Get API Keys from Supabase Dashboard
              </a>
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
