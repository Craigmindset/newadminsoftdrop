"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"

// Mock BVN data that would normally come from an API
const mockBvnData = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-05-15",
}

export default function CarrierDataPage() {
  const router = useRouter()
  const [carriageType, setCarriageType] = useState("")
  const [registeredNumber, setRegisteredNumber] = useState("")
  const [registrantName, setRegistrantName] = useState("")
  const [color, setColor] = useState("")
  const [model, setModel] = useState("")
  const [carriageImage, setCarriageImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCarriageImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const needsCarriageDetails = carriageType === "bike" || carriageType === "car"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Store carriage information in local storage
    localStorage.setItem("carriageType", carriageType)
    localStorage.setItem("registeredNumber", registeredNumber)
    localStorage.setItem("registrantName", registrantName)
    localStorage.setItem("color", color)
    localStorage.setItem("model", model)

    router.push("/signup/carrier/kyc/processing")
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-0 max-w-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Carrier Verification</h2>
        <p className="text-muted-foreground">Step 4 of 4: Personal Information</p>
        <Progress value={100} className="mt-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Please confirm your details and provide carriage information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" value={mockBvnData.firstName} disabled />
                  <p className="text-xs text-muted-foreground">Retrieved from BVN</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" value={mockBvnData.lastName} disabled />
                  <p className="text-xs text-muted-foreground">Retrieved from BVN</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={mockBvnData.dateOfBirth} disabled />
                <p className="text-xs text-muted-foreground">Retrieved from BVN</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Means of Carriage</h3>
              <RadioGroup
                value={carriageType}
                onValueChange={setCarriageType}
                className="grid grid-cols-2 gap-2 md:gap-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="pedestrian" id="pedestrian" />
                  <Label htmlFor="pedestrian" className="font-normal">
                    Pedestrian
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="bicycle" id="bicycle" />
                  <Label htmlFor="bicycle" className="font-normal">
                    Bicycle
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="bike" id="bike" />
                  <Label htmlFor="bike" className="font-normal">
                    Bike
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="car" id="car" />
                  <Label htmlFor="car" className="font-normal">
                    Car
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {needsCarriageDetails && (
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Carriage Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="reg-number">Registration Number</Label>
                  <Input
                    id="reg-number"
                    placeholder="Enter vehicle registration number"
                    value={registeredNumber}
                    onChange={(e) => setRegisteredNumber(e.target.value)}
                    required={needsCarriageDetails}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrant">Name of Registrant</Label>
                  <Input
                    id="registrant"
                    placeholder="Enter name of carriage registrant"
                    value={registrantName}
                    onChange={(e) => setRegistrantName(e.target.value)}
                    required={needsCarriageDetails}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="Vehicle color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      required={needsCarriageDetails}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="Vehicle model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required={needsCarriageDetails}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carriage-image">Upload Carriage Image</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("carriage-image")?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <Input
                      id="carriage-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required={needsCarriageDetails}
                    />
                    <span className="text-sm text-muted-foreground">
                      {carriageImage ? carriageImage.name : "No file chosen"}
                    </span>
                  </div>

                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Carriage preview"
                        className="max-h-40 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Submit Details <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
