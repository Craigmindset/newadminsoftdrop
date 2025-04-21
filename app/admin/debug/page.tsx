"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-supabase")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Debug test error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Diagnostics</h1>

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
              <CardTitle>Diagnostic Results</CardTitle>
              <CardDescription>Testing Supabase connection and configuration</CardDescription>
            </div>
            <Button onClick={runTests} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Tests Again"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p>Running diagnostic tests...</p>
            </div>
          ) : results ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Overall Status</h2>
                  <p className="text-sm text-gray-500">Environment: {results.environment}</p>
                  <p className="text-sm text-gray-500">Timestamp: {new Date(results.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.overallSuccess)}
                  <span className={results.overallSuccess ? "text-green-600" : "text-red-600"}>
                    {results.overallSuccess ? "All tests passed" : "Some tests failed"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(results.tests).map(([testName, testResult]: [string, any]) => (
                  <Card key={testName}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base capitalize">
                          {testName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(testResult.success)}
                          <span
                            className={
                              testResult.success
                                ? "text-green-600"
                                : testResult.success === false
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }
                          >
                            {testResult.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3">
                      {testResult.error ? (
                        <Alert variant="destructive">
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{testResult.error}</AlertDescription>
                        </Alert>
                      ) : (
                        <div className="text-sm">
                          {testResult.details && (
                            <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-40">
                              {JSON.stringify(testResult.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No results available. Please run the tests.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Troubleshooting Steps</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">If Environment Variables Test Failed:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check that all required environment variables are set in your Vercel project settings</li>
            <li>
              Verify that <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> is correctly
              formatted (e.g., https://your-project.supabase.co)
            </li>
            <li>
              Ensure <code className="bg-gray-100 px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is set (this is
              different from the anon key)
            </li>
            <li>After updating environment variables, redeploy your application</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">If Database Connection Test Failed:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verify that your Supabase project is active and not in maintenance mode</li>
            <li>
              Check that the <code className="bg-gray-100 px-1 py-0.5 rounded">sender_profiles</code> table exists in
              your database
            </li>
            <li>Ensure your service role key has the necessary permissions</li>
            <li>Check if your IP is allowed in Supabase's network restrictions (if enabled)</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">General Troubleshooting:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check Vercel logs for any server-side errors</li>
            <li>Verify that your Supabase project and Vercel project are in the same region for optimal performance</li>
            <li>Try clearing browser cookies and cache, then logging in again</li>
            <li>Ensure your Supabase project has not reached its connection limits</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
