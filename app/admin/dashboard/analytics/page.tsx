"use client"

import { useEffect, useMemo, useState } from "react"
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#4F46E5"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [totalUsers, setTotalUsers] = useState(0)
  const [transactionVolume, setTransactionVolume] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [kpiLoading, setKpiLoading] = useState(true)
  const [userGrowthData, setUserGrowthData] = useState<any[]>([])
  const [userTypeData, setUserTypeData] = useState<any[]>([])
  const [transactionData, setTransactionData] = useState<any[]>([])
  const [profitData, setProfitData] = useState<any[]>([])
  const [deliveryTypeData, setDeliveryTypeData] = useState<any[]>([])
  const [routeData, setRouteData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [carrierPerformance, setCarrierPerformance] = useState<any[]>([])

  useEffect(() => {
    let active = true

    async function loadKpis() {
      setKpiLoading(true)
      const response = await fetch("/api/admin/analytics")
      if (!response.ok) {
        if (active) {
          setKpiLoading(false)
        }
        return
      }

      const data = await response.json()
      if (!active) {
        return
      }

      setTotalUsers(Number(data.totalUsers || 0))
      setTransactionVolume(Number(data.transactionVolume || 0))
      setTotalProfit(Number(data.totalProfit || 0))
      setKpiLoading(false)
    }

    loadKpis()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadCharts() {
      const response = await fetch("/api/admin/analytics/charts")
      if (!response.ok) {
        return
      }

      const data = await response.json()
      if (!active) {
        return
      }

      setUserGrowthData(data.userGrowth || [])
      setUserTypeData([
        { name: "Senders", value: data.userType?.senders || 0 },
        { name: "Carriers", value: data.userType?.carriers || 0 },
      ])
      setTransactionData(data.transactionVolume || [])
      setProfitData(data.profitSeries || [])
      setDeliveryTypeData(data.deliveryTypes || [])
      setRouteData(data.routeDistribution || [])
      setStatusData(data.statusDistribution || [])
      setCarrierPerformance(data.carrierPerformance || [])
    }

    loadCharts()

    return () => {
      active = false
    }
  }, [])

  const deliveryColors = useMemo(
    () => COLORS.slice(0, deliveryTypeData.length || 1),
    [deliveryTypeData.length],
  )

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiLoading ? "—" : totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Senders + carriers</p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{kpiLoading ? "—" : transactionVolume.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Delivery + airtime volume</p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{kpiLoading ? "—" : totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Delivery commission total</p>
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
              <CardContent className="h-80 overflow-hidden">
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
                    <LineChart data={userGrowthData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
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
              <CardContent className="h-80 overflow-hidden">
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
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Route Distribution</CardTitle>
              <CardDescription>Deliveries by route</CardDescription>
            </CardHeader>
            <CardContent className="h-80 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routeData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} deliveries`, "Volume"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
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
              <CardContent className="h-80 overflow-hidden">
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
                    <BarChart data={transactionData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="value" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
                <CardDescription>Monthly delivery commission</CardDescription>
              </CardHeader>
              <CardContent className="h-80 overflow-hidden">
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
                    <LineChart data={profitData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
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
            <CardContent className="h-80 overflow-hidden">
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
                  <LineChart margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" allowDuplicatedCategory={false} />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
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
              <CardContent className="h-80 overflow-hidden">
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
                        <Cell key={`cell-${index}`} fill={deliveryColors[index % deliveryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carrier Performance</CardTitle>
                <CardDescription>Top 5 carriers by delivery volume</CardDescription>
              </CardHeader>
              <CardContent className="h-80 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={carrierPerformance} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="deliveries" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Status Breakdown</CardTitle>
              <CardDescription>Completed vs pending deliveries</CardDescription>
            </CardHeader>
            <CardContent className="h-80 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} deliveries`, "Count"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
