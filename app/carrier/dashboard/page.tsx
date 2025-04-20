import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CreditCard, DollarSign } from "lucide-react"

export default function CarrierDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          Carrier Dashboard <Truck className="h-6 w-6 text-primary" />
        </h1>
        <div className="mt-4">
          <p className="font-medium">Welcome back!</p>
          <p className="text-muted-foreground">Here's an overview of your activities.</p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Active Deliveries</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">2</div>
            <p className="text-xs text-gray-400">1 pickup pending</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Completed</CardTitle>
            <Truck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-gray-400">+4 from last week</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Wallet Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦12,500</div>
            <p className="text-xs text-gray-400">Ready to withdraw</p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-white">
            <CardTitle className="text-sm font-medium text-white">Escrow Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦5,000</div>
            <p className="text-xs text-gray-400">Pending release</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="available">Available Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="border rounded-md p-3 md:p-4 mt-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 md:pb-4">
              <div>
                <p className="text-sm md:text-base font-medium">Document Delivery</p>
                <p className="text-xs md:text-sm text-muted-foreground">Ikeja to Victoria Island, Lagos</p>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base font-medium text-amber-600">In Progress</p>
                <p className="text-xs md:text-sm text-muted-foreground">₦2,500</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Package Delivery</p>
                <p className="text-sm text-muted-foreground">Lekki to Ikoyi, Lagos</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">Pickup Pending</p>
                <p className="text-sm text-muted-foreground">₦3,000</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="available" className="border rounded-md p-4 mt-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Document Delivery</p>
                <p className="text-sm text-muted-foreground">Surulere to Yaba, Lagos</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦2,000</p>
                <p className="text-sm text-muted-foreground">2.5 km</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Fragile Package</p>
                <p className="text-sm text-muted-foreground">Ajah to Lekki, Lagos</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦3,500</p>
                <p className="text-sm text-muted-foreground">6 km</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Clothes Delivery</p>
                <p className="text-sm text-muted-foreground">Ikeja to Oshodi, Lagos</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦1,800</p>
                <p className="text-sm text-muted-foreground">3 km</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
