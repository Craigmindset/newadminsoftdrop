"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label, Textarea } from "@/components/ui/textarea"
import type { ProfileFormData } from "@/app/actions/update-profile"
import { Loader2 } from "lucide-react"
import MobileImageUpload from "./mobile-image-upload"
import { isMobileDevice } from "@/lib/mobile-image-utils"
import useNotifications from "@/hooks/use-notifications"

import { useFormState, useFormStatus } from "react-dom"
import { updateProfile } from "@/app/actions/profile"
import { cookies } from "next/headers"

type SenderProfile = {
  id?: string
  user_id: string
  phone_number: string
  full_name?: string
  email?: string
  address?: string
  profile_image_url?: string
}

interface ProfileFormProps {
  initialData: SenderProfile | null
  userId: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  )
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(initialData?.profile_image_url || null)
  const [imageFile, setImageFile] = useState<File | Blob | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData?.full_name || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
  })
  const isMobile = isMobileDevice()
  const { addNotification } = useNotifications()
  const [success, setSuccess] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [carriageType, setCarriageType] = useState("")
  const [registeredNumber, setRegisteredNumber] = useState("")
  const [registrantName, setRegistrantName] = useState("")
  const [color, setColor] = useState("")
  const [model, setModel] = useState("")
  const [state, formAction] = useFormState(updateProfile, { success: false })

  // Load first name and last name from local storage
  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName")
    const storedLastName = localStorage.getItem("lastName")
    if (storedFirstName) setFirstName(storedFirstName)
    if (storedLastName) setLastName(storedLastName)

    const storedCarriageType = localStorage.getItem("carriageType")
    const storedRegisteredNumber = localStorage.getItem("registeredNumber")
    const storedRegistrantName = localStorage.getItem("registrantName")
    const storedColor = localStorage.getItem("color")
    const storedModel = localStorage.getItem("model")

    if (storedCarriageType) setCarriageType(storedCarriageType)
    if (storedRegisteredNumber) setRegisteredNumber(storedRegisteredNumber)
    if (storedRegistrantName) setRegistrantName(storedRegistrantName)
    if (storedColor) setColor(storedColor)
    if (storedModel) setModel(storedModel)
  }, [])

  // Load phone number from session cookie
  useEffect(() => {
    const getPhoneNumberFromSession = async () => {
      const sessionCookie = cookies().get("sb-session")
      if (sessionCookie?.value) {
        try {
          const session = JSON.parse(sessionCookie.value)
          setPhoneNumber(session.phoneNumber || "")
        } catch (error) {
          console.error("Failed to parse session cookie:", error)
        }
      }
    }

    getPhoneNumberFromSession()
  }, [])

  // Reset form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.full_name || "",
        email: initialData.email || "",
        address: initialData.address || "",
      })
      setProfileImage(initialData.profile_image_url || null)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (file: File | Blob) => {
    setImageFile(file)
  }

  const handleImageRemove = () => {
    setProfileImage(null)
    setImageFile(null)
  }

  const handleSubmit = async (e: React.Event) => {
    e.preventDefault()
    //setIsSubmitting(true)

    // try {
    //   // Upload image first if there's a new image
    //   if (imageFile) {
    //     await handleImageUpload()
    //   }

    //   // Log client-side submission attempt
    //   console.log(`[${new Date().toISOString()}] Profile update submission attempt`, {
    //     environment: process.env.NODE_ENV,
    //   })

    //   const result = await updateSenderProfile(formData)

    //   if (result.success) {
    //     setSuccess(true)
    //     addNotification({
    //       title: "Profile Updated",
    //       description: "Your profile information has been updated successfully.",
    //       type: "success",
    //     })
    //   } else {
    //     addNotification({
    //       title: "Update Failed",
    //       description: result.error || "Failed to update profile. Please try again.",
    //       type: "error",
    //     })
    //   }
    // } catch (error) {
    //   // Handle unexpected client-side errors
    //   console.error("Profile form submission error:", error)

    //   // Log detailed error information
    //   const errorInfo = {
    //     timestamp: new Date().toISOString(),
    //     error:
    //       error instanceof Error
    //         ? {
    //             name: error.name,
    //             message: error.message,
    //             stack: error.stack,
    //           }
    //         : String(error),
    //     environment: process.env.NODE_ENV,
    //   }
    //   console.error("Client-side error details:", errorInfo)

    //   addNotification({
    //     title: "Error",
    //     description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    //     type: "error",
    //   })
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  const hasChanges = () => {
    return (
      formData.fullName !== initialData?.full_name ||
      formData.email !== initialData?.email ||
      formData.address !== initialData?.address ||
      profileImage !== initialData?.profile_image_url
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={phoneNumber} disabled className="bg-muted/50" />
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Carriage Information</h3>

              <div className="space-y-2">
                <Label htmlFor="carriageType">Means of Carriage</Label>
                <Input
                  id="carriageType"
                  name="carriageType"
                  placeholder="Enter your means of carriage"
                  value={carriageType}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredNumber">Registration Number</Label>
                <Input
                  id="registeredNumber"
                  name="registeredNumber"
                  placeholder="Enter your registration number"
                  value={registeredNumber}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrantName">Name of Registrant</Label>
                <Input
                  id="registrantName"
                  name="registrantName"
                  placeholder="Enter name of registrant"
                  value={registrantName}
                  disabled
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" name="color" placeholder="Enter color" value={color} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" placeholder="Enter model" value={model} disabled />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <SubmitButton />
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
          <MobileImageUpload
            initialImage={profileImage}
            userName={`${firstName} ${lastName}`}
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            isUploading={isUploading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
