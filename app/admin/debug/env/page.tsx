"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EnvironmentDebugPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [envData, setEnvData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchEnvData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/env")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setEnvData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Environment debug error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvData()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Current environment configuration</CardDescription>
            </div>
            <Button onClick={fetchEnvData} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p>Loading environment data...</p>
            </div>
          ) : envData ? (
            <div className="space-y-6">
              {envData.ISSUES && envData.ISSUES.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Environment Issues Detected</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2">
                      {envData.ISSUES.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-4 py-2 text-left">Variable</th>
                      <th className="border px-4 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(envData)
                      .filter(([key]) => key !== "ISSUES")
                      .map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="border px-4 py-2 font-mono text-sm">{key}</td>
                          <td className="border px-4 py-2 font-mono text-sm">{value as string}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-4">
                <h2 className="text-xl font-semibold">How to Fix Common Issues</h2>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">VERCEL_ENV set to Supabase URL</h3>
                  <p>This happens when environment variables are incorrectly configured in Vercel.</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Go to your Vercel project dashboard</li>
                    <li>Navigate to Settings → Environment Variables</li>
                    <li>Check if VERCEL_ENV is manually set (it shouldn't be, as it's a system variable)</li>
                    <li>If it exists, remove it as Vercel sets this automatically</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Invalid URL Format</h3>
                  <p>This happens when the Supabase URL is incorrectly formatted.</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Go to your Vercel project dashboard</li>
                    <li>Navigate to Settings → Environment Variables</li>
                    <li>Check NEXT_PUBLIC_SUPABASE_URL format (should be like https://your-project.supabase.co)</li>
                    <li>Make sure it doesn't include "NEXT_PUBLIC_SUPABASE_URL=" in the value</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No environment data available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
