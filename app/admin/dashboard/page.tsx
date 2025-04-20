"use client"

import { useState } from "react"
import { BarChart3, CreditCard, DollarSign, ShieldAlert, TrendingUp, Truck, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisputeStatistics } from "@/components/admin/dispute-statistics"
import { useRouter } from "next/navigation"

// Updated mock data for demonstration
const mockStats = {
  totalUsers: 31260,
  activeCarriers: 19864,
  activeSenders: 11396,
  pendingDisputes: 318,
  totalTransactions: 14587,
  revenue: 4224580,
  weeklyGrowth: 12.5,
}

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("weekly")
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="weekly" className="w-[300px]" onValueChange={setTimeframe}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              {mockStats.activeCarriers.toLocaleString()} carriers, {mockStats.activeSenders.toLocaleString()} senders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Carriers</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeCarriers.toLocaleString()}</div>
            <p className="text-xs text-gray-500">
              +{Math.floor(Math.random() * 20)}% from last {timeframe.slice(0, -2)}
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => router.push("/admin/dashboard/disputes")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
            <ShieldAlert className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingDisputes}</div>
            <p className="text-xs text-gray-500">{Math.floor(Math.random() * 10)} high priority</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => router.push("/admin/dashboard/transactions")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{mockStats.revenue.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                +{mockStats.weeklyGrowth}% from last {timeframe.slice(0, -2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispute Statistics */}
      <DisputeStatistics />

      {/* Financial Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Financial performance for the current {timeframe}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <BarChart3 className="h-16 w-16 text-gray-400" />
              <span className="ml-2 text-gray-500">Revenue Chart</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Breakdown of transaction types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Interstate Deliveries</span>
                    <span className="text-sm text-gray-500">64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: "64%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Local Deliveries</span>
                    <span className="text-sm text-gray-500">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Express Deliveries</span>
                    <span className="text-sm text-gray-500">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: "8%" }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold">{mockStats.totalTransactions.toLocaleString()}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i % 3 === 0
                      ? "bg-green-100 text-green-600"
                      : i % 3 === 1
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {i % 3 === 0 ? (
                    <Users className="h-4 w-4" />
                  ) : i % 3 === 1 ? (
                    <CreditCard className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {i % 3 === 0
                        ? "New user registered"
                        : i % 3 === 1
                          ? "New transaction completed"
                          : "Dispute resolved"}
                    </p>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 60)} min ago</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {i % 3 === 0
                      ? "A new sender has completed registration"
                      : i % 3 === 1
                        ? "Interstate delivery transaction #" + Math.floor(Math.random() * 10000)
                        : "Dispute #" + Math.floor(Math.random() * 1000) + " was resolved successfully"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
