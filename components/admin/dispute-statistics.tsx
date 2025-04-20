"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Mock data for dispute statistics
const mockDisputeStats = {
  daily: {
    total: 12,
    pending: 5,
    inReview: 3,
    resolved: 4,
    byType: {
      "delivery-issue": 5,
      "damaged-item": 3,
      "wrong-item": 2,
      "payment-issue": 2,
    },
    resolutionRate: 33,
  },
  weekly: {
    total: 42,
    pending: 15,
    inReview: 8,
    resolved: 19,
    byType: {
      "delivery-issue": 18,
      "damaged-item": 12,
      "wrong-item": 7,
      "payment-issue": 5,
    },
    resolutionRate: 45,
  },
  monthly: {
    total: 156,
    pending: 35,
    inReview: 22,
    resolved: 99,
    byType: {
      "delivery-issue": 68,
      "damaged-item": 42,
      "wrong-item": 25,
      "payment-issue": 21,
    },
    resolutionRate: 63,
  },
}

export function DisputeStatistics() {
  const [timeframe, setTimeframe] = useState("weekly")

  // Get stats based on the selected timeframe
  const stats = mockDisputeStats[timeframe as keyof typeof mockDisputeStats]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Dispute Statistics</CardTitle>
          <CardDescription>Overview of platform disputes and resolutions</CardDescription>
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
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-medium">Total Disputes</h3>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h3 className="text-sm font-medium">Pending</h3>
            </div>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-medium">In Review</h3>
            </div>
            <div className="text-2xl font-bold">{stats.inReview}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="text-sm font-medium">Resolved</h3>
            </div>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium mb-3">Disputes by Type</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Delivery Issues</span>
                  <span className="text-sm">
                    {stats.byType["delivery-issue"]} ({Math.round((stats.byType["delivery-issue"] / stats.total) * 100)}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(stats.byType["delivery-issue"] / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Damaged Items</span>
                  <span className="text-sm">
                    {stats.byType["damaged-item"]} ({Math.round((stats.byType["damaged-item"] / stats.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(stats.byType["damaged-item"] / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Wrong Items</span>
                  <span className="text-sm">
                    {stats.byType["wrong-item"]} ({Math.round((stats.byType["wrong-item"] / stats.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(stats.byType["wrong-item"] / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Payment Issues</span>
                  <span className="text-sm">
                    {stats.byType["payment-issue"]} ({Math.round((stats.byType["payment-issue"] / stats.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(stats.byType["payment-issue"] / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Resolution Rate</h3>
            <div className="bg-gray-50 rounded-lg p-4 h-[calc(100%-24px)] flex flex-col justify-between">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{stats.resolutionRate}%</div>
                <p className="text-sm text-gray-500 mt-1">of disputes resolved</p>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center"
                    style={{ width: `${stats.resolutionRate}%` }}
                  >
                    {stats.resolutionRate}%
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Average Resolution Time</p>
                  <p className="text-sm text-gray-500">2.3 days</p>
                </div>

                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
