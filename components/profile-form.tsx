"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSenderProfile, type ProfileFormData } from "@/app/actions/update-profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Check, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SenderProfile = {
  id?: string
  user_id: string
  phone_number: string
  created_at?: string
  updated_at?: string
  full_name?: string
  email?: string
  address?: string
}

interface ProfileFormProps {
  initialData: SenderProfile | null
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData?.full_name || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
  })

  // Reset form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.full_name || "",
        email: initialData.email || "",
        address: initialData.address || "",
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear success and error states when form is modified
    if (success) setSuccess(false)
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)
    setErrorDetails(null)

    try {
      // Log client-side submission attempt
      console.log(`[${new Date().toISOString()}] Profile update submission attempt`, {
        environment: process.env.NODE_ENV,
        retryCount,
      })

      const result = await updateSenderProfile(formData)

      if (result.success) {
        setSuccess(true)
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        })
        // Reset retry count on success
        setRetryCount(0)
      } else {
        console.error("Profile update error:", result)

        // Set error state for UI display
        setError(result.error || "Failed to update profile. Please try again.")
        setErrorDetails(result.errorDetails || null)

        // Show toast with error message
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Handle unexpected client-side errors
      console.error("Profile form submission error:", error)

      // Log detailed error information
      const errorInfo = {
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
        environment: process.env.NODE_ENV,
        retryCount,
      }
      console.error("Client-side error details:", errorInfo)

      // Set error state for UI display
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")

      // Show toast with error message
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setError(null)
    setErrorDetails(null)
    handleSubmit(new Event("submit") as any)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error updating profile</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>{error}</p>
                {errorDetails && (
                  <details className="text-xs">
                    <summary className="cursor-pointer">Technical details</summary>
                    <pre className="mt-2 whitespace-pre-wrap bg-destructive/10 p-2 rounded">
                      {JSON.stringify(errorDetails, null, 2)}
                    </pre>
                  </details>
                )}
                <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2" disabled={isSubmitting}>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50 text-green-800">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your profile has been updated successfully.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" value={initialData?.phone_number || ""} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">
                This is the phone number you used to register. It cannot be changed.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !hasChanges()} className="w-full md:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : success ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Updated
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  function hasChanges() {
    return (
      formData.fullName !== (initialData?.full_name || "") ||
      formData.email !== (initialData?.email || "") ||
      formData.address !== (initialData?.address || "")
    )
  }
}
