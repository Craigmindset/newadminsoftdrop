"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Camera, Upload, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import PlacesAutocomplete from "@/components/places-autocomplete"
import { Toaster } from "@/components/ui/toaster"

declare global {
  interface Window {
    google: any
  }
}

export default function SendItemPage() {
  const router = useRouter()
  const [route, setRoute] = useState("intercity")
  const [documentType, setDocumentType] = useState("")
  const [insure, setInsure] = useState(false)
  const [itemValue, setItemValue] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverPhone, setReceiverPhone] = useState("")
  const [deliveryPin, setDeliveryPin] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropLocation, setDropLocation] = useState("")
  const [pickupCoordinates, setPickupCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [dropCoordinates, setDropCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [itemImage, setItemImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deliveryMode, setDeliveryMode] = useState<"door" | "arrival" | "">("")
  const [showDoorDeliveryDialog, setShowDoorDeliveryDialog] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setItemImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setDeliveryPin(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setReceiverPhone(value)
  }

  const handleDeliveryModeChange = (value: string) => {
    if (value === "door") {
      setShowDoorDeliveryDialog(true)
    }
    setDeliveryMode(value as "door" | "arrival")
  }

  const handleConfirmDoorDelivery = () => {
    setShowDoorDeliveryDialog(false)
    // Here you would typically update pricing or add fees
  }

  const handlePickupPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setPickupLocation(place.formatted_address)
    }
    if (place.geometry?.location) {
      setPickupCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    }
  }

  const handleDropPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setDropLocation(place.formatted_address)
    }
    if (place.geometry?.location) {
      setDropCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate and process the form data
    // You can now include the coordinates in your submission
    console.log("Pickup coordinates:", pickupCoordinates)
    console.log("Drop coordinates:", dropCoordinates)
    router.push("/dashboard/send/carriers")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Send Item</h1>
        <p className="text-muted-foreground">Fill in the details to find a carrier for your item.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>Provide information about the item you want to send</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Select Route</Label>
                <RadioGroup
                  value={route}
                  onValueChange={setRoute}
                  className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intercity" id="intercity" />
                    <Label htmlFor="intercity" className="font-normal">
                      Intracity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interstate" id="interstate" />
                    <Label htmlFor="interstate" className="font-normal">
                      Interstate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="international" id="international" disabled />
                    <Label htmlFor="international" className="font-normal text-muted-foreground">
                      International (Coming Soon)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {route === "interstate" && (
                <div className="space-y-2 border rounded-lg p-4 bg-muted/20">
                  <Label htmlFor="delivery-mode">Delivery Mode</Label>
                  <RadioGroup
                    value={deliveryMode}
                    onValueChange={handleDeliveryModeChange}
                    className="flex flex-row space-x-4 mt-2 sm:flex-col sm:space-x-0 sm:space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="door" id="door-delivery" />
                      <Label htmlFor="door-delivery" className="font-normal">
                        Door Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="arrival" id="upon-arrival" />
                      <Label htmlFor="upon-arrival" className="font-normal">
                        Upon Arrival
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType} required>
                  <SelectTrigger id="document-type" className="mt-1">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="consumable">Consumable</SelectItem>
                    <SelectItem value="clothes">Clothes</SelectItem>
                    <SelectItem value="fragile">Fragile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="insure"
                  checked={insure}
                  onCheckedChange={(checked) => {
                    setInsure(checked === true)
                    if (checked === false) {
                      setItemValue("")
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="insure" className="font-normal text-sm">
                    Insure this item
                  </Label>
                  <p className="text-sm text-muted-foreground">Add insurance to protect your item during transit</p>
                </div>
              </div>

              {insure && (
                <div>
                  <Label htmlFor="item-value">Item Value (₦)</Label>
                  <Input
                    id="item-value"
                    type="number"
                    placeholder="Enter item value"
                    className="mt-1"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    required={insure}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Receiver Information</h3>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <Label htmlFor="receiver-name">Receiver Name</Label>
                  <Input
                    id="receiver-name"
                    placeholder="Enter receiver's full name"
                    className="mt-1"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receiver-phone">Receiver Phone</Label>
                  <Input
                    id="receiver-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter receiver's phone number"
                    className="mt-1"
                    value={receiverPhone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="delivery-pin">Delivery PIN (4 digits)</Label>
                <Input
                  id="delivery-pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter 4-digit delivery PIN"
                  className="mt-1"
                  value={deliveryPin}
                  onChange={handlePinChange}
                  maxLength={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This PIN will be required from the receiver to confirm delivery
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pickup & Delivery Locations</h3>

              <div className="space-y-1">
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <div className="mt-1">
                  <PlacesAutocomplete
                    placeholder="Search for pickup address"
                    onPlaceSelect={handlePickupPlaceSelect}
                    defaultValue={pickupLocation}
                    showCurrentLocation={true}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the location pin to use your current location
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="drop-location">Drop Location</Label>
                <div className="mt-1">
                  <PlacesAutocomplete
                    placeholder="Search for delivery address"
                    onPlaceSelect={handleDropPlaceSelect}
                    defaultValue={dropLocation}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Item Image (Optional)</h3>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <Label htmlFor="item-image" className="block mb-2">
                    Upload Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("item-image")?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose File
                    </Button>
                    <Input
                      id="item-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {itemImage ? itemImage.name : "No file chosen"}
                    </span>
                  </div>
                </div>
                <div>
                  {imagePreview ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Item preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-md border bg-muted">
                      <Camera className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Find Carrier
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Door Delivery Dialog */}
      <Dialog open={showDoorDeliveryDialog} onOpenChange={setShowDoorDeliveryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Door Delivery Selected</DialogTitle>
            <DialogDescription>Please note that door delivery service comes with additional charges.</DialogDescription>
          </DialogHeader>

          <Alert className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Additional Fee</AlertTitle>
            <AlertDescription>
              An extra fee will be added to your estimated delivery charges for door-to-door service.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button onClick={handleConfirmDoorDelivery}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
