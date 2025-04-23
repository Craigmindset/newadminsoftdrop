"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/textarea"
import type { ProfileFormData, SenderProfile } from "@/app/actions/update-profile"
import { Loader2 } from "lucide-react"
import MobileImageUpload from "./mobile-image-upload"
import { isMobileDevice } from "@/lib/mobile-image-utils"
import useNotifications from "@/hooks/use-notifications"
import { useFormState, useFormStatus } from "react-dom"
import { updateProfile } from "@/app/actions/profile"

interface ProfileFormProps {
  initialData: SenderProfile | null
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        "Update Profile"
      )}
    </Button>
  )
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
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
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phone_number || "")
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

  const handleImageSelect = (file: File | Blob) => {
    setImageFile(file)
  }

  const handleImageRemove = () => {
    setProfileImage(null)
    setImageFile(null)
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Enter your last name" value={lastName} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" value={phoneNumber} disabled className="bg-muted/50" />
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
                  defaultValue={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  defaultValue={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
