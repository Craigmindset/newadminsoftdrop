"use client"

import { useState } from "react"
import { BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for commission analytics
const mockCommissionData = {
  daily: [
    { date: "2023-09-10", transactions: 42, amount: 98500, commission: 14775 },
    { date: "2023-09-11", transactions: 38, amount: 87200, commission: 13080 },
    { date: "2023-09-12", transactions: 45, amount: 105000, commission: 15750 },
    { date: "2023-09-13", transactions: 52, amount: 124800, commission: 18720 },
    { date: "2023-09-14", transactions: 48, amount: 112500, commission: 16875 },
    { date: "2023-09-15", transactions: 56, amount: 132000, commission: 19800 },
    { date: "2023-09-16", transactions: 61, amount: 145000, commission: 21750 },
  ],
  weekly: [
    { week: "Week 1", transactions: 320, amount: 750000, commission: 112500 },
    { week: "Week 2", transactions: 345, amount: 820000, commission: 123000 },
    { week: "Week 3", transactions: 380, amount: 890000, commission: 133500 },
    { week: "Week 4", transactions: 410, amount: 980000, commission: 147000 },
  ],
  monthly: [
    { month: "Jan", transactions: 1250, amount: 2950000, commission: 442500 },
    { month: "Feb", transactions: 1320, amount: 3100000, commission: 465000 },
    { month: "Mar", transactions: 1450, amount: 3400000, commission: 510000 },
    { month: "Apr", transactions: 1380, amount: 3250000, commission: 487500 },
    { month: "May", transactions: 1520, amount: 3600000, commission: 540000 },
    { month: "Jun", transactions: 1650, amount: 3900000, commission: 585000 },
    { month: "Jul", transactions: 1720, amount: 4050000, commission: 607500 },
    { month: "Aug", transactions: 1850, amount: 4350000, commission: 652500 },
    { month: "Sep", transactions: 1420, amount: 3350000, commission: 502500 },
  ],
}

export function CommissionAnalytics() {
  const [timeframe, setTimeframe] = useState("weekly")

  // Calculate totals based on the selected timeframe
  const data = mockCommissionData[timeframe as keyof typeof mockCommissionData]
  const totalTransactions = data.reduce((sum, item) => sum + item.transactions, 0)
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)
  const totalCommission = data.reduce((sum, item) => sum + item.commission, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Commission Analytics</CardTitle>
          <CardDescription>Overview of platform commission earnings</CardDescription>
        </div>
        <Tabs defaultValue="weekly" value={timeframe} onValueChange={setTimeframe}>
          <TabsList className="grid w-[250px] grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Total Transactions</h3>
            <div className="text-2xl font-bold">{totalTransactions.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                +{Math.floor(Math.random() * 10) + 5}% from previous {timeframe.slice(0, -2)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Transaction Volume</h3>
            <div className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                +{Math.floor(Math.random() * 10) + 3}% from previous {timeframe.slice(0, -2)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Commission Earned</h3>
            <div className="text-2xl font-bold">₦{totalCommission.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                +{Math.floor(Math.random() * 10) + 4}% from previous {timeframe.slice(0, -2)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
          <BarChart3 className="h-16 w-16 text-gray-400" />
          <span className="ml-2 text-gray-500">Commission Chart</span>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Commission Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-sm">
                    {timeframe === "daily" ? "Date" : timeframe === "weekly" ? "Week" : "Month"}
                  </th>
                  <th className="text-left py-2 px-4 font-medium text-sm">Transactions</th>
                  <th className="text-left py-2 px-4 font-medium text-sm">Volume</th>
                  <th className="text-left py-2 px-4 font-medium text-sm">Commission (15%)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-4">
                      <span className="font-medium">
                        {timeframe === "daily"
                          ? new Date(item.date).toLocaleDateString()
                          : timeframe === "weekly"
                            ? item.week
                            : item.month}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm">{item.transactions.toLocaleString()}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm">₦{item.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm font-medium text-green-600">₦{item.commission.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
