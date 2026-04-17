"use client"

import { use, useEffect, useMemo, useState } from "react"
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

const COMMISSION_RATE = 0.05

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [transaction, setTransaction] = useState<any>(null)

  useEffect(() => {
    let active = true

    async function loadTransaction() {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/admin/transactions/${id}`)
      if (!response.ok) {
        if (!active) {
          return
        }
        setError("Unable to load transaction")
        setLoading(false)
        return
      }

      const payload = await response.json()
      if (!active) {
        return
      }

      setTransaction(payload.data)
      setLoading(false)
    }

    loadTransaction()

    return () => {
      active = false
    }
  }, [id])

  const delivery = transaction?.delivery
  const sender = transaction?.sender
  const carrier = transaction?.carrier

  const statusLabel = useMemo(() => {
    const value = delivery?.status
    if (!value) {
      return "-"
    }
    return value.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
  }, [delivery?.status])

  const amountValue = Number(delivery?.amount || 0)
  const commissionValue = amountValue * COMMISSION_RATE
  const carrierEarnings = amountValue - commissionValue

  const timeline = useMemo(() => {
    if (!delivery) {
      return []
    }

    return [
      {
        status: "Order Created",
        date: delivery.created_at,
        description: "Delivery request created",
      },
      {
        status: "Last Updated",
        date: delivery.updated_at,
        description: "Latest status update",
      },
    ]
  }, [delivery])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500">Loading transaction...</div>
      </div>
    )
  }

  if (error || !delivery) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-red-600">{error || "Transaction not found"}</div>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Package {String(delivery?.id || "").slice(-7)}
          </h1>
          <p className="text-gray-500">
            {delivery?.created_at ? new Date(delivery.created_at).toLocaleString() : "-"} •{" "}
            {delivery?.route ? delivery.route.toUpperCase() : "-"} Delivery
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              delivery?.status === "completed"
                ? "bg-green-100 text-green-800"
                : delivery?.status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : delivery?.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
            }
          >
            {statusLabel}
          </Badge>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm">
            {delivery?.payment_status
              ? delivery.payment_status.replace(/_/g, " ")
              : "-"} Payment
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
                        sender?.profile_image ||
                        `/placeholder.svg?height=40&width=40&text=${
                          sender?.name?.charAt(0) || "?"
                        }`
                      }
                    />
                    <AvatarFallback>{sender?.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{sender?.name || "-"}</p>
                    <p className="text-sm text-gray-500">{sender?.email || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">ID: {sender?.id || "-"}</p>
                      <p className="text-sm text-gray-500">
                        Phone: {sender?.phone_number || "-"}
                      </p>
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
                        carrier?.profile_image ||
                        `/placeholder.svg?height=40&width=40&text=${
                          carrier?.name?.charAt(0) || "?"
                        }`
                      }
                    />
                    <AvatarFallback>{carrier?.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{carrier?.name || "-"}</p>
                    <p className="text-sm text-gray-500">{carrier?.email || "-"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">ID: {carrier?.id || "-"}</p>
                      <p className="text-sm text-gray-500">
                        Phone: {carrier?.phone_number || "-"}
                      </p>
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
                        {delivery?.item_type
                          ? delivery.item_type.charAt(0).toUpperCase() + delivery.item_type.slice(1)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-sm">{delivery?.pickup_location || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Delivery Method</p>
                      <p className="text-sm">{delivery?.delivery_method || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Drop Location</p>
                      <p className="text-sm">{delivery?.dropoff_location || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium mb-1">Receiver</p>
                  <p className="text-sm">{delivery?.receiver_name || "-"}</p>
                  <p className="text-xs text-gray-500">{delivery?.receiver_contact || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Sender</p>
                  <p className="text-sm">{delivery?.sender_name || "-"}</p>
                  <p className="text-xs text-gray-500">{delivery?.sender_contact || "-"}</p>
                </div>
              </div>

              {delivery?.is_insured && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <p className="text-sm">Item is insured</p>
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
                  {timeline.map((event, index) => (
                    <div key={index} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${
                          index === timeline.length - 1
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index === timeline.length - 1 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{event.status}</span>
                          <span className="text-xs text-gray-500">
                            {event.date ? new Date(event.date).toLocaleString() : "-"}
                          </span>
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
                  <span className="text-lg font-bold">₦{amountValue.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platform Commission (5%)</span>
                    <span className="text-sm font-medium text-green-600">
                      ₦{commissionValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carrier Earnings (95%)</span>
                    <span className="text-sm font-medium">₦{carrierEarnings.toLocaleString()}</span>
                  </div>

                  {delivery?.is_insured && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Insurance</span>
                      <span className="text-sm font-medium">Included</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Platform Revenue</span>
                    <span className="font-bold text-green-600">₦{commissionValue.toLocaleString()}</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>5% Commission Rate</span>
                      <span>95% to Carrier</span>
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
                    {delivery?.payment_status
                      ? delivery.payment_status.replace(/_/g, " ")
                      : "-"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Payment Date</h3>
                  </div>
                  <p className="text-sm">
                    {delivery?.updated_at ? new Date(delivery.updated_at).toLocaleString() : "-"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">Settlement Status</h3>
                  </div>
                  <p className="text-sm">
                    {delivery?.payment_status
                      ? delivery.payment_status.replace(/_/g, " ")
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium">Package ID</span>
                <span className="text-sm">{String(delivery?.id || "").slice(-7)}</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
