"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock transaction data - in a real app, you would fetch this based on the ID
const mockTransaction = {
  id: "TRX-12345",
  date: "2023-09-15T14:30:00",
  sender: {
    id: "SND-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 812 345 6789",
    avatar: null,
  },
  carrier: {
    id: "CAR-001",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+234 803 987 6543",
    avatar: null,
  },
  amount: 2500,
  commission: 375, // 15% of 2500
  carrierEarnings: 2125, // 85% of 2500
  status: "completed",
  type: "intracity",
  paymentMethod: "wallet",
  itemType: "document",
  itemDescription: "Important business documents",
  insurance: true,
  insuranceAmount: 200,
  pickupLocation: "123 Main Street, Ikeja, Lagos",
  dropLocation: "456 Park Avenue, Victoria Island, Lagos",
  distance: 15.3, // in km
  timeline: [
    {
      status: "Order Created",
      date: "2023-09-15T13:15:00",
      description: "Order was created by the sender",
    },
    {
      status: "Payment Confirmed",
      date: "2023-09-15T13:16:00",
      description: "Payment was confirmed via wallet",
    },
    {
      status: "Carrier Assigned",
      date: "2023-09-15T13:20:00",
      description: "Sarah Johnson accepted the delivery request",
    },
    {
      status: "Pickup",
      date: "2023-09-15T13:45:00",
      description: "Item was picked up from the sender",
    },
    {
      status: "In Transit",
      date: "2023-09-15T13:50:00",
      description: "Carrier is en route to the destination",
    },
    {
      status: "Delivered",
      date: "2023-09-15T14:30:00",
      description: "Item was successfully delivered to the recipient",
    },
  ],
}

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")

  // In a real app, you would fetch the transaction data based on the ID
  const transaction = mockTransaction

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaction {transaction.id}</h1>
          <p className="text-gray-500">
            {new Date(transaction.date).toLocaleString()} •{" "}
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Delivery
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              transaction.status === "completed"
                ? "bg-green-100 text-green-800"
                : transaction.status === "in-transit"
                  ? "bg-blue-100 text-blue-800"
                  : transaction.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
            }
          >
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Badge>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm">
            {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)} Payment
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Receipt
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Transaction Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financial">Financial Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sender Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        transaction.sender.avatar ||
                        `/placeholder.svg?height=40&width=40&text=${transaction.sender.name.charAt(0)}`
                      }
                    />
                    <AvatarFallback>{transaction.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{transaction.sender.name}</p>
                    <p className="text-sm text-gray-500">{transaction.sender.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">ID: {transaction.sender.id}</p>
                      <p className="text-sm text-gray-500">Phone: {transaction.sender.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carrier Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        transaction.carrier.avatar ||
                        `/placeholder.svg?height=40&width=40&text=${transaction.carrier.name.charAt(0)}`
                      }
                    />
                    <AvatarFallback>{transaction.carrier.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{transaction.carrier.name}</p>
                    <p className="text-sm text-gray-500">{transaction.carrier.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">ID: {transaction.carrier.id}</p>
                      <p className="text-sm text-gray-500">Phone: {transaction.carrier.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Item Type</p>
                      <p className="text-sm">
                        {transaction.itemType.charAt(0).toUpperCase() + transaction.itemType.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-sm">{transaction.pickupLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Distance</p>
                      <p className="text-sm">{transaction.distance} km</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Drop Location</p>
                      <p className="text-sm">{transaction.dropLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-1">Item Description</p>
                <p className="text-sm">{transaction.itemDescription}</p>
              </div>

              {transaction.insurance && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <p className="text-sm">Item is insured for ₦{transaction.insuranceAmount.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Timeline</CardTitle>
              <CardDescription>Complete history of this transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-8">
                  {transaction.timeline.map((event, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${
                          index === transaction.timeline.length - 1
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index === transaction.timeline.length - 1 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.status}</span>
                          <span className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Breakdown</CardTitle>
              <CardDescription>Detailed financial information for this transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Transaction Amount</span>
                  <span className="text-lg font-bold">₦{transaction.amount.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platform Commission (15%)</span>
                    <span className="text-sm font-medium text-green-600">
                      ₦{transaction.commission.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carrier Earnings (85%)</span>
                    <span className="text-sm font-medium">₦{transaction.carrierEarnings.toLocaleString()}</span>
                  </div>

                  {transaction.insurance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Insurance Fee</span>
                      <span className="text-sm font-medium">₦{transaction.insuranceAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Platform Revenue</span>
                    <span className="font-bold text-green-600">₦{transaction.commission.toLocaleString()}</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>15% Commission Rate</span>
                      <span>85% to Carrier</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Payment Method</h3>
                  </div>
                  <p className="text-sm">
                    {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Payment Date</h3>
                  </div>
                  <p className="text-sm">{new Date(transaction.timeline[1].date).toLocaleString()}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Settlement Status</h3>
                  </div>
                  <p className="text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium">Transaction ID</span>
                <span className="text-sm">{transaction.id}</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
