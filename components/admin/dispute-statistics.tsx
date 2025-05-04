"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getDisputeStatistics, type TimeframeOption } from "@/lib/admin-data"
import type { DisputeStats } from "@/lib/admin-data"

export function DisputeStatistics() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("weekly")
  const [stats, setStats] = useState<DisputeStats>({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
    byType: {},
    resolutionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getDisputeStatistics(timeframe)
        setStats(data)
      } catch (error) {
        console.error("Error fetching dispute statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

  // Get dispute types and ensure we have at least some default types
  const disputeTypes =
    Object.keys(stats.byType).length > 0
      ? Object.keys(stats.byType)
      : ["delivery-issue", "damaged-item", "wrong-item", "payment-issue"]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Dispute Statistics</CardTitle>
          <CardDescription>Overview of platform disputes and resolutions</CardDescription>
        </div>
        <Tabs
          defaultValue={timeframe}
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeframeOption)}
        >
          <TabsList className="grid w-[250px] grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
            </div>
          </div>
        ) : (
          <>
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
                  {disputeTypes.map((type) => {
                    const count = stats.byType[type] || 0
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0

                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">
                            {type
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </span>
                          <span className="text-sm">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              type === "delivery-issue"
                                ? "bg-blue-500"
                                : type === "damaged-item"
                                  ? "bg-red-500"
                                  : type === "wrong-item"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
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
                      <p className="text-sm text-gray-500">Calculating...</p>
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
