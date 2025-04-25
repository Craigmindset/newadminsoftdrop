"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

// Update the useState hook to retrieve the first name and last name from local storage
export default function CarrierProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userData, setUserData] = useState({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: "+234 812 345 6789",
    email: "sarah.johnson@example.com",
    profileImage: null,
    vehicleType: "Car",
    vehiclePlate: "LND 123 XY",
  })
  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: "+234 812 345 6789",
    email: "sarah.johnson@example.com",
    profileImage: null,
    vehicleType: "Car",
    vehiclePlate: "LND 123 XY",
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Move the localStorage access inside a useEffect hook
  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName") || ""
    const storedLastName = localStorage.getItem("lastName") || ""
    setFirstName(storedFirstName)
    setLastName(storedLastName)
  }, [])

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, you would fetch the user data from your API
    const fetchUserData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Set the user data
        setUserData({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: "+234 812 345 6789",
          email: "sarah.johnson@example.com",
          profileImage: null,
          vehicleType: "Car",
          vehiclePlate: "LND 123 XY",
        })
        setFormData({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: "+234 812 345 6789",
          email: "sarah.johnson@example.com",
          profileImage: null,
          vehicleType: "Car",
          vehiclePlate: "LND 123 XY",
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load profile data. Please try again.")
      }
    }

    fetchUserData()
  }, [firstName, lastName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "firstName") {
      setFirstName(value)
      localStorage.setItem("firstName", value)
    }
    if (name === "lastName") {
      setLastName(value)
      localStorage.setItem("lastName", value)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true)

      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        // Simulate upload delay
        setTimeout(() => {
          setProfileImage(reader.result as string)
          setIsUploading(false)
        }, 1500)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        throw new Error("First name and last name are required")
      }

      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update user data with form data and profile image
      setUserData({
        ...formData,
        profileImage: profileImage,
      })

      setSuccess("Profile updated successfully!")
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasChanges = () => {
    return (
      formData.firstName !== userData.firstName ||
      formData.lastName !== userData.lastName ||
      formData.email !== userData.email ||
      formData.vehiclePlate !== userData.vehiclePlate ||
      profileImage !== userData.profileImage
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-500 text-green-500">
                <Check className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the phone number you used to register. It cannot be changed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Input
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Vehicle type can only be changed by contacting support.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate">Vehicle Plate Number</Label>
                  <Input
                    id="vehiclePlate"
                    name="vehiclePlate"
                    placeholder="Enter your vehicle plate number"
                    value={formData.vehiclePlate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !hasChanges()} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="relative cursor-pointer group" onClick={handleImageClick}>
              <Avatar className="h-32 w-32 border-2 border-muted">
                <AvatarImage src={profileImage || "/placeholder.svg"} />
                <AvatarFallback className="text-4xl">
                  {formData.firstName.charAt(0)}
                  {formData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>

              {profileImage && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            <Button type="button" variant="outline" onClick={handleImageClick} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : profileImage ? (
                "Change Picture"
              ) : (
                "Upload Picture"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Recommended: Square image, at least 300x300 pixels.
              <br />
              Maximum file size: 5MB.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
