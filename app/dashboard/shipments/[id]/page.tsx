"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck, Phone, Clock, MapPin, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapView } from "@/components/map-view"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CallInterface } from "@/components/call-interface"
import { MessageInterface } from "@/components/message-interface"

// Mock shipment data - in a real app, this would come from an API
const shipmentData = {
  id: "SHP-1235",
  type: "Package",
  description: "Medium-sized package containing books",
  route: "Ikeja to Victoria Island",
  status: "pending-pickup",
  statusText: "Pending Pickup",
  date: "Today",
  carrierName: "Sarah Johnson",
  carrierPhone: "+234 812 345 6789",
  carrierRating: 4.8,
  carrierType: "Car",
  carrierPlate: "LND 123 XY",
  eta: "15 mins",
  isPickup: true,
  trackingEvents: [
    { status: "Order Created", time: "10:30 AM", date: "Today", completed: true },
    { status: "Carrier Assigned", time: "10:45 AM", date: "Today", completed: true },
    { status: "En Route to Pickup", time: "11:00 AM", date: "Today", completed: true },
    { status: "Pickup", time: "11:15 AM", date: "Today", completed: false },
    { status: "In Transit", time: "", date: "", completed: false },
    { status: "Delivered", time: "", date: "", completed: false },
  ],
  pickupLocation: {
    lat: 30,
    lng: 40,
    address: "123 Main Street, Ikeja, Lagos",
  },
  dropoffLocation: {
    lat: 70,
    lng: 60,
    address: "456 Park Avenue, Victoria Island, Lagos",
  },
  carrierLocation: {
    lat: 10,
    lng: 20,
  },
}

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [shipment, setShipment] = useState(shipmentData)
  const [progress, setProgress] = useState(0)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)

  // Simulate fetching shipment data
  useEffect(() => {
    // In a real app, you would fetch the shipment data based on the ID
    console.log(`Fetching shipment with ID: ${params.id}`)

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1
        return newProgress > 100 ? 100 : newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [params.id])

  const currentStep = shipment.trackingEvents.findIndex((event) => !event.completed)
  const progressPercentage = currentStep === -1 ? 100 : (currentStep / shipment.trackingEvents.length) * 100

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tracking {shipment.id}</h1>
          <p className="text-muted-foreground">{shipment.route}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Map Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Live Tracking</CardTitle>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {shipment.isPickup ? "Pickup Phase" : "Delivery Phase"}
                </Badge>
              </div>
              <CardDescription>
                {shipment.isPickup
                  ? "Carrier is on the way to pick up your package"
                  : "Carrier is delivering your package"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapView
                pickupLocation={shipment.pickupLocation}
                dropoffLocation={shipment.dropoffLocation}
                carrierLocation={shipment.carrierLocation}
                isPickupPhase={shipment.isPickup}
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    ETA: <span className="font-medium">{shipment.eta}</span>
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsMessageDialogOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Carrier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Events Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />

                <div className="space-y-6">
                  {shipment.trackingEvents.map((event, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${
                          event.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{event.status}</span>
                        {event.time && (
                          <span className="text-sm text-muted-foreground">
                            {event.time}, {event.date}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Carrier Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Carrier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={shipment.carrierName} />
                  <AvatarFallback>{shipment.carrierName?.charAt(0) || "C"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{shipment.carrierName}</div>
                  <div className="text-sm text-muted-foreground">
                    {shipment.carrierType} Carrier • {shipment.carrierRating} ★
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{shipment.carrierPhone}</span>
                </div>
                {shipment.carrierPlate && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Vehicle: {shipment.carrierPlate}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setIsCallDialogOpen(true)}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsMessageDialogOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tracking ID:</span>
                  <span className="text-sm font-medium">{shipment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Item Type:</span>
                  <span className="text-sm font-medium">{shipment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Description:</span>
                  <span className="text-sm font-medium">{shipment.description}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Pickup Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{shipment.pickupLocation.address}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Dropoff Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{shipment.dropoffLocation.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CallInterface
        open={isCallDialogOpen}
        onOpenChange={setIsCallDialogOpen}
        contact={{
          name: shipment.carrierName || "Carrier",
          phone: shipment.carrierPhone || "",
          avatar: "/placeholder.svg",
        }}
      />

      <MessageInterface
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        contact={{
          name: shipment.carrierName || "Carrier",
          avatar: "/placeholder.svg",
        }}
      />
    </div>
  )
}
