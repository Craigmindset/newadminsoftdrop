"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Package, User } from "lucide-react"

export default function SummaryPage() {
  const router = useRouter()

  const handleConfirm = () => {
    // In a real app, you would process the payment and create the shipment
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Carrier Confirmed</h1>
      </div>
      <p className="text-muted-foreground">Your carrier has been notified and will pick up your item soon.</p>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Summary</CardTitle>
          <CardDescription>Review your shipment details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-3 md:p-4">
            <h3 className="font-medium">Tracking Information</h3>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tracking ID:</span>
                <span className="text-sm font-medium">LS-12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-medium text-amber-600">Pending Pickup</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated Delivery:</span>
                <span className="text-sm font-medium">Today, 3:00 PM</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="rounded-lg border p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Item Details</h3>
              </div>
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

            <div className="rounded-lg border p-3 md:p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Receiver Information</h3>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm font-medium">John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm font-medium">+234 812 345 6789</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-3 md:p-4">
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

          <div className="rounded-lg border p-3 md:p-4">
            <h3 className="font-medium">Payment Details</h3>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Delivery Fee:</span>
                <span className="text-sm font-medium">₦2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Insurance Fee:</span>
                <span className="text-sm font-medium">₦500</span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm font-medium">₦3,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Method:</span>
                <span className="text-sm font-medium">Wallet</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleConfirm} className="w-full">
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
