"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Check, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { isMobileDevice } from "@/lib/mobile-image-utils"

export default function TroubleshootPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const isMobile = isMobileDevice()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setResult(null)
    }
  }

  const handleTestUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setIsUploading(true)
    setError(null)
    setResult(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Send to diagnostic endpoint
      const response = await fetch("/api/debug/upload-diagnostics", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Upload test error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Upload Troubleshooter</h1>
          <p className="text-muted-foreground">Diagnose and fix profile image upload issues</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Image Upload</CardTitle>
          <CardDescription>
            This tool helps diagnose issues with uploading profile images, especially on mobile devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-file">Select an image to test</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="test-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                capture={isMobile ? "environment" : undefined}
              />
              <Button onClick={() => fileInputRef.current?.click()}>Browse</Button>
            </div>
          </div>

          {file && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Selected File</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Name:</div>
                <div className="font-mono">{file.name}</div>
                <div>Type:</div>
                <div className="font-mono">{file.type || "Unknown"}</div>
                <div>Size:</div>
                <div className="font-mono">{(file.size / 1024).toFixed(2)} KB</div>
                <div>Last Modified:</div>
                <div className="font-mono">{new Date(file.lastModified).toLocaleString()}</div>
              </div>
            </div>
          )}

          <Button onClick={handleTestUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Upload...
              </>
            ) : (
              "Test Upload"
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert
                variant={result.success ? "default" : "destructive"}
                className={result.success ? "bg-green-50 border-green-200" : ""}
              >
                {result.success ? <Check className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {result.success
                    ? "The test upload was successful. Your device can properly upload images."
                    : result.error || "The test upload failed."}
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Diagnostic Information</h3>
                <details>
                  <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                    {JSON.stringify(result.diagnostics, null, 2)}
                  </pre>
                </details>
              </div>

              {isMobile && (
                <div className="space-y-2">
                  <h3 className="font-medium">Mobile-Specific Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Try using a smaller image or taking a photo with lower resolution</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Try using a different browser</li>
                    <li>Make sure your device has sufficient storage space</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
