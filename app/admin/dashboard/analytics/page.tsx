"use client"

import { useState } from "react"
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Updated data for Jan-Apr 2025
const userGrowthData = [
  { month: "Jan 2025", senders: 120, carriers: 80 },
  { month: "Feb 2025", senders: 150, carriers: 100 },
  { month: "Mar 2025", senders: 200, carriers: 120 },
  { month: "Apr 2025", senders: 250, carriers: 150 },
]

const transactionData = [
  { month: "Jan 2025", value: 0 },
  { month: "Feb 2025", value: 117000 },
  { month: "Mar 2025", value: 157500 },
  { month: "Apr 2025", value: 200000 }, // Projected
]

const profitData = [
  { month: "Jan 2025", profit: 0 },
  { month: "Feb 2025", profit: 5850 },
  { month: "Mar 2025", profit: 7875 },
  { month: "Apr 2025", profit: 10000 }, // Projected
]

const userTypeData = [
  { name: "Senders", value: 168 },
  { name: "Carriers", value: 292 },
]

const COLORS = ["#0088FE", "#00C49F"]

const deliveryTypeData = [
  { name: "Standard", value: 65 },
  { name: "Express", value: 25 },
  { name: "Same Day", value: 10 },
]

const DELIVERY_COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

const geographicData = [
  { city: "Lagos", transactions: 450 },
  { city: "Abuja", transactions: 300 },
  { city: "Port Harcourt", transactions: 200 },
  { city: "Kano", transactions: 150 },
  { city: "Ibadan", transactions: 120 },
  { city: "Others", transactions: 280 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")

  // Calculate summary metrics
  const totalUsers = userTypeData.reduce((sum, item) => sum + item.value, 0)
  const totalTransactions = transactionData.reduce((sum, item) => sum + item.value, 0)
  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0)
  const averageTransactionValue = Math.round(totalTransactions / (transactionData.length - 1)) // Excluding January with 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+18.2% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit (5% Commission)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+15.7% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{averageTransactionValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+5.3% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="operational">Operational Analytics</TabsTrigger>
        </TabsList>

        {/* User Analytics Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly growth of senders and carriers</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    senders: {
                      label: "Senders",
                      color: "hsl(var(--chart-1))",
                    },
                    carriers: {
                      label: "Carriers",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="senders"
                        stroke="var(--color-senders)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="carriers" stroke="var(--color-carriers)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of user types</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Transaction volume by city</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} transactions`, "Volume"]} />
                  <Legend />
                  <Bar dataKey="transactions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Analytics Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Monthly transaction volume in Naira</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    value: {
                      label: "Transaction Volume",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
                <CardDescription>Monthly profit (5% commission)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    profit: {
                      label: "Profit",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="var(--color-profit)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Profit</CardTitle>
              <CardDescription>Comparison of total transaction volume and profit</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  value: {
                    label: "Transaction Volume",
                    color: "hsl(var(--chart-1))",
                  },
                  profit: {
                    label: "Profit",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" allowDuplicatedCategory={false} />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      data={transactionData}
                      dataKey="value"
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      name="Transaction Volume"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      data={profitData}
                      dataKey="profit"
                      stroke="var(--color-profit)"
                      strokeWidth={2}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operational Analytics Tab */}
        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Type Distribution</CardTitle>
                <CardDescription>Breakdown of delivery types</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deliveryTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DELIVERY_COLORS[index % DELIVERY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carrier Performance</CardTitle>
                <CardDescription>Top 5 carriers by delivery volume</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Carrier A", deliveries: 120 },
                      { name: "Carrier B", deliveries: 100 },
                      { name: "Carrier C", deliveries: 80 },
                      { name: "Carrier D", deliveries: 70 },
                      { name: "Carrier E", deliveries: 60 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deliveries" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Time Analysis</CardTitle>
              <CardDescription>Average delivery time by delivery type (in hours)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: "Same Day", time: 3 },
                    { type: "Express", time: 12 },
                    { type: "Standard", time: 48 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hours`, "Avg. Time"]} />
                  <Legend />
                  <Bar dataKey="time" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
