import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CreditCard, Clock } from "lucide-react"

export default function DashboardPage() {
  console.log("Dashboard page loaded")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          Sender Dashboard <Package className="h-6 w-6 text-primary" />
        </h1>
        <div className="mt-4">
          <p className="font-medium">Welcome back!</p>
          <p className="text-muted-foreground">Here's an overview of your logistics activities.</p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">3</div>
            <p className="text-xs text-gray-400">+2 from last week</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
            <Truck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">12</div>
            <p className="text-xs text-gray-400">+5 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Wallet Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">₦15,000</div>
            <p className="text-xs text-gray-400">Last funded 3 days ago</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Pending Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">2</div>
            <p className="text-xs text-gray-400">Estimated delivery today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Shipments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Pickups</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="border rounded-md p-3 md:p-4 mt-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 md:pb-4">
              <div>
                <p className="text-sm md:text-base font-medium">Document Delivery</p>
                <p className="text-xs md:text-sm text-muted-foreground">Lagos to Abuja</p>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base font-medium text-green-600">Delivered</p>
                <p className="text-xs md:text-sm text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-3 md:pb-4">
              <div>
                <p className="text-sm md:text-base font-medium">Fragile Package</p>
                <p className="text-xs md:text-sm text-muted-foreground">Lagos to Ibadan</p>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base font-medium text-amber-600">In Transit</p>
                <p className="text-xs md:text-sm text-muted-foreground">Today</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base font-medium">Clothes Delivery</p>
                <p className="text-xs md:text-sm text-muted-foreground">Lagos to Port Harcourt</p>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base font-medium text-blue-600">Processing</p>
                <p className="text-xs md:text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="upcoming" className="border rounded-md p-4 mt-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Document Package</p>
                <p className="text-sm text-muted-foreground">Lagos to Kano</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Pickup Scheduled</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Consumable Items</p>
                <p className="text-sm text-muted-foreground">Lagos to Enugu</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Pickup Scheduled</p>
                <p className="text-sm text-muted-foreground">Mar 8, 2:00 PM</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
