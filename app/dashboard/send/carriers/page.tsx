"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BikeIcon as Bicycle, Car, Clock, MapPin, BikeIcon as MotorcycleBike, User } from "lucide-react"

// Dummy carrier data
const carriers = [
  {
    id: "ped",
    name: "Ped Carrier",
    icon: User,
    price: 1500,
    eta: "3-4 hours",
    description: "On-foot delivery for short distances",
  },
  {
    id: "bicycle",
    name: "Bicycle Carrier",
    icon: Bicycle,
    price: 2000,
    eta: "2-3 hours",
    description: "Eco-friendly option for small packages",
  },
  {
    id: "bike",
    name: "Bike Carrier",
    icon: MotorcycleBike,
    price: 2500,
    eta: "1-2 hours",
    description: "Fast delivery for urgent items",
  },
  {
    id: "car",
    name: "Car Carrier",
    icon: Car,
    price: 3500,
    eta: "1-3 hours",
    description: "Comfortable transport for larger items",
  },
]

export default function CarriersPage() {
  const router = useRouter()
  const [selectedCarrier, setSelectedCarrier] = useState("")

  const handleConfirm = () => {
    // In a real app, you would process the carrier selection
    router.push("/dashboard/send/summary")
  }

  const getSelectedCarrier = () => {
    return carriers.find((carrier) => carrier.id === selectedCarrier)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Select Carrier</h1>
        <p className="text-muted-foreground">Choose the best carrier option for your delivery</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Carriers</CardTitle>
            <CardDescription>Select a carrier type that suits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedCarrier} onValueChange={setSelectedCarrier} className="space-y-4">
              {carriers.map((carrier) => (
                <div key={carrier.id} className="flex">
                  <RadioGroupItem value={carrier.id} id={carrier.id} className="peer sr-only" />
                  <Label
                    htmlFor={carrier.id}
                    className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-muted bg-popover p-3 md:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/10">
                        <carrier.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm md:text-base font-medium">{carrier.name}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{carrier.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm md:text-base font-medium">₦{carrier.price.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {carrier.eta}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Summary</CardTitle>
            <CardDescription>Review your delivery details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Route Details</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Pickup Location</p>
                    <p className="text-sm text-muted-foreground">123 Main Street, Ikeja, Lagos</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Drop Location</p>
                    <p className="text-sm text-muted-foreground">456 Park Avenue, Victoria Island, Lagos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Item Details</h3>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Item Type:</span>
                  <span className="text-sm font-medium">Document</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Insurance:</span>
                  <span className="text-sm font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Item Value:</span>
                  <span className="text-sm font-medium">₦10,000</span>
                </div>
              </div>
            </div>

            {selectedCarrier && (
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Selected Carrier</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Carrier Type:</span>
                    <span className="text-sm font-medium">{getSelectedCarrier()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Delivery Fee:</span>
                    <span className="text-sm font-medium">₦{getSelectedCarrier()?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Delivery:</span>
                    <span className="text-sm font-medium">{getSelectedCarrier()?.eta}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleConfirm} className="w-full" disabled={!selectedCarrier}>
              Confirm Carrier
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
