"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Truck, CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock shipment data
const shipments = [
  {
    id: "SHP-1234",
    type: "Document",
    route: "Lagos to Abuja",
    status: "in-transit",
    statusText: "In Transit",
    date: "Today",
    carrierName: "John Doe",
    carrierType: "Bike",
    eta: "30 mins",
    isPickup: false,
  },
  {
    id: "SHP-1235",
    type: "Package",
    route: "Ikeja to Victoria Island",
    status: "pending-pickup",
    statusText: "Pending Pickup",
    date: "Today",
    carrierName: "Sarah Johnson",
    carrierType: "Car",
    eta: "15 mins",
    isPickup: true,
  },
  {
    id: "SHP-1236",
    type: "Fragile",
    route: "Lagos to Ibadan",
    status: "delivered",
    statusText: "Delivered",
    date: "Yesterday",
    carrierName: "Michael Smith",
    carrierType: "Car",
    eta: null,
    isPickup: false,
  },
  {
    id: "SHP-1237",
    type: "Document",
    route: "Lekki to Ikoyi",
    status: "cancelled",
    statusText: "Cancelled",
    date: "Mar 2, 2025",
    carrierName: null,
    carrierType: null,
    eta: null,
    isPickup: false,
  },
  {
    id: "SHP-1238",
    type: "Clothes",
    route: "Lagos to Port Harcourt",
    status: "processing",
    statusText: "Processing",
    date: "Today",
    carrierName: null,
    carrierType: null,
    eta: null,
    isPickup: false,
  },
]

export default function ShipmentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")

  const activeShipments = shipments.filter((shipment) =>
    ["in-transit", "pending-pickup", "processing"].includes(shipment.status),
  )

  const completedShipments = shipments.filter((shipment) => ["delivered", "cancelled"].includes(shipment.status))

  const handleShipmentClick = (id: string) => {
    router.push(`/dashboard/shipments/${id}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-transit":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "pending-pickup":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "processing":
        return <Package className="h-4 w-4 text-purple-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "pending-pickup":
        return "bg-amber-100 text-amber-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderShipmentCard = (shipment: (typeof shipments)[0]) => (
    <Card
      key={shipment.id}
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => handleShipmentClick(shipment.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{shipment.type}</span>
                <Badge variant="outline" className={getStatusColor(shipment.status)}>
                  {shipment.statusText}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{shipment.route}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            {getStatusIcon(shipment.status)}
            <span>
              {shipment.isPickup ? "Pickup" : "Delivery"} {shipment.date}
            </span>
          </div>
          {shipment.eta && <div className="font-medium">ETA: {shipment.eta}</div>}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shipments</h1>
        <p className="text-muted-foreground">Track and manage your shipments</p>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active
            {activeShipments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeShipments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedShipments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {completedShipments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          {activeShipments.length > 0 ? (
            activeShipments.map(renderShipmentCard)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No active shipments</h3>
              <p className="text-muted-foreground mt-1">You don't have any active shipments at the moment.</p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/send")}>
                Send an Item
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedShipments.length > 0 ? (
            completedShipments.map(renderShipmentCard)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No completed shipments</h3>
              <p className="text-muted-foreground mt-1">You don't have any completed shipments yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
