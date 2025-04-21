"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSenderProfile, type ProfileFormData } from "@/app/actions/update-profile"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Check, AlertCircle, Camera, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

type SenderProfile = {
  id?: string
  user_id: string
  phone_number: string
  created_at?: string
  updated_at?: string
  full_name?: string
  email?: string
  address?: string
  profile_image_url?: string
}

interface ProfileFormProps {
  initialData: SenderProfile | null
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(initialData?.profile_image_url || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [storageError, setStorageError] = useState(false)
  const [adminCredentialsMissing, setAdminCredentialsMissing] = useState(false)

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData?.full_name || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
  })

  // Update form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.full_name || "",
        email: initialData.email || "",
        address: initialData.address || "",
      })
      setProfileImagePreview(initialData.profile_image_url || null)
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
    if (warning) setWarning(null)
  }

  const handleImageClick = () => {
    if (storageError || adminCredentialsMissing) {
      toast({
        title: "Image Upload Unavailable",
        description: "Profile image upload is currently unavailable. Please contact the administrator.",
        variant: "destructive",
      })
      return
    }
    fileInputRef.current?.click()
  }

  const setImagePreview = (url: string) => {
    setProfileImagePreview(url)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setProfileImage(file)
      setImagePreview(URL.createObjectURL(file))

      // Clear success and error states when form is modified
      if (success) setSuccess(false)
      if (error) setError(null)
      if (warning) setWarning(null)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setProfileImage(null)
    setProfileImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    // Clear success and error states when form is modified
    if (success) setSuccess(false)
    if (error) setError(null)
    if (warning) setWarning(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)
    setWarning(null)

    try {
      // Basic validation
      if (formData.email && !isValidEmail(formData.email)) {
        setError("Please enter a valid email address")
        setIsSubmitting(false)
        return
      }

      // Create FormData object for file upload
      const submitData = new FormData()
      submitData.append("fullName", formData.fullName || "")
      submitData.append("email", formData.email || "")
      submitData.append("address", formData.address || "")

      if (profileImage && !adminCredentialsMissing) {
        setIsUploading(true)
        submitData.append("profileImage", profileImage)
      } else if (profileImagePreview === null && initialData?.profile_image_url && !adminCredentialsMissing) {
        // If the user removed the image
        submitData.append("removeProfileImage", "true")
      }

      const result = await updateSenderProfile(submitData)

      if (result.success) {
        setSuccess(true)

        // Check if there was a warning about image upload
        if (result.warning) {
          setWarning(result.error || "Profile image couldn't be uploaded")
          setStorageError(true)

          toast({
            title: "Profile Partially Updated",
            description: "Your profile information was updated, but we couldn't upload your profile image.",
          })
        } else {
          toast({
            title: "Profile Updated",
            description: "Your profile information has been updated successfully.",
          })
        }

        // Refresh the page to show updated data
        router.refresh()
      } else {
        setError(result.error || "Failed to update profile. Please try again.")

        // Check if the error is related to missing admin credentials
        if (result.error?.includes("Missing Supabase admin credentials")) {
          setAdminCredentialsMissing(true)
          setStorageError(true)
        }
        // Check if the error is related to storage
        else if (
          result.error?.includes("Storage") ||
          result.error?.includes("bucket") ||
          result.error?.includes("row-level security") ||
          result.error?.includes("Permission denied")
        ) {
          setStorageError(true)
          toast({
            title: "Update Failed",
            description: "We couldn't update your profile due to permission issues.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Update Failed",
            description: result.error || "Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Profile update error:", error)
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  // Helper function to validate email format
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Check if form data has changed from initial values
  function hasChanges(): boolean {
    return (
      formData.fullName !== (initialData?.full_name || "") ||
      formData.email !== (initialData?.email || "") ||
      formData.address !== (initialData?.address || "") ||
      profileImage !== null ||
      (profileImagePreview === null && initialData?.profile_image_url !== null)
    )
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!formData.fullName) return "U"
    return formData.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        {adminCredentialsMissing && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <AlertTitle>Missing Supabase admin credentials</AlertTitle>
              <p>Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.</p>
              <p className="text-sm mt-2">
                You can still update your profile information, but profile image upload is unavailable.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {error && !adminCredentialsMissing && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {storageError && (
                <div className="mt-2 text-sm">
                  <AlertTitle>Storage Not Available</AlertTitle>
                  <p>
                    Profile image upload is currently unavailable. You can still update your other profile information.
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {warning && !error && (
          <Alert className="mb-6 border-amber-500 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              <AlertTitle>Profile Partially Updated</AlertTitle>
              <p>Your profile information was updated, but we couldn't upload your profile image.</p>
              <p className="text-sm mt-1">{warning}</p>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-3">
              <Label htmlFor="profileImage">Profile Picture</Label>
              <div
                className={`relative ${!storageError && !adminCredentialsMissing ? "cursor-pointer" : ""} group`}
                onClick={storageError || adminCredentialsMissing ? undefined : handleImageClick}
              >
                <Avatar className="h-24 w-24 border-2 border-muted">
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage src={profileImagePreview || ""} alt="Profile" />
                      <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                    </>
                  )}
                </Avatar>

                {!storageError && !adminCredentialsMissing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}

                {profileImagePreview && !isUploading && !storageError && !adminCredentialsMissing && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isUploading || storageError || adminCredentialsMissing}
              />
              <p className="text-xs text-muted-foreground text-center">
                {storageError || adminCredentialsMissing
                  ? "Profile image upload is currently unavailable"
                  : "Click to upload or change your profile picture"}
                <br />
                {!storageError && !adminCredentialsMissing && "(Max size: 2MB)"}
              </p>
            </div>

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

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting || !hasChanges()} className="w-full md:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Updating..."}
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
}
