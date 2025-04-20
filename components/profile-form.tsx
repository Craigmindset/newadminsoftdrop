"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSenderProfile, type ProfileFormData } from "@/app/actions/update-profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Check } from "lucide-react"

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
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData?.full_name || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear success state when form is modified
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)

    try {
      const result = await updateSenderProfile(formData)

      if (result.success) {
        setSuccess(true)
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        })
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
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
