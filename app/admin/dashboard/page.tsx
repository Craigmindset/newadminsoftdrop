import { Suspense } from "react";
import {
  CreditCard,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisputeStatistics } from "@/components/admin/dispute-statistics";
import { getAdminDashboardStats, getRecentActivity } from "@/lib/admin-data";

export default async function AdminDashboard() {
  const stats = await getAdminDashboardStats();
  const recentActivities = await getRecentActivity(5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="weekly" className="w-[300px]">
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
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600">
              {stats.activeCarriers.toLocaleString()} carriers,{" "}
              {stats.activeSenders.toLocaleString()} senders
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Active Carriers
            </CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.activeCarriers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">
              +{stats.weeklyGrowth}% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 cursor-pointer hover:bg-red-100/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">
              Pending Disputes
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {stats.pendingDisputes}
            </div>
            <p className="text-xs text-red-600">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50/50 cursor-pointer hover:bg-purple-100/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ₦{stats.revenue.toLocaleString()}
            </div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                +{stats.weeklyGrowth}% from last week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispute Statistics */}
      <Suspense
        fallback={
          <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-md"></div>
        }
      >
        <DisputeStatistics />
      </Suspense>

      {/* Financial Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Financial performance for the current period
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-gray-500">
                Revenue chart will be implemented soon
              </p>
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
                    <span className="text-sm font-medium">
                      Interstate Deliveries
                    </span>
                    <span className="text-sm text-gray-500">64%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      Local Deliveries
                    </span>
                    <span className="text-sm text-gray-500">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      Express Deliveries
                    </span>
                    <span className="text-sm text-gray-500">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "8%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold">
                      {stats.totalTransactions.toLocaleString()}
                    </p>
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
          <CardDescription>
            Latest transactions and user activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                No recent activity found
              </p>
            ) : (
              recentActivities.map((activity, i) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "user_registration"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "transaction"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {activity.type === "user_registration" ? (
                      <Users className="h-4 w-4" />
                    ) : activity.type === "transaction" ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <ShieldAlert className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {activity.type === "user_registration"
                          ? `New ${activity.data.role} registered`
                          : activity.type === "transaction"
                          ? `New ${
                              activity.data.type || "standard"
                            } transaction completed`
                          : `Dispute ${
                              activity.data.status === "resolved"
                                ? "resolved"
                                : "updated"
                            }`}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.type === "user_registration"
                        ? `${
                            activity.data.full_name || "A new user"
                          } has completed registration`
                        : activity.type === "transaction"
                        ? `Transaction #${activity.id} for ₦${
                            activity.data.amount?.toLocaleString() || "0"
                          }`
                        : `Dispute #${activity.id} ${activity.data.status}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
