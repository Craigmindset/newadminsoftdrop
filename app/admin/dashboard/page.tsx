"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

export default function AdminDashboard() {
  const [totalSenders, setTotalSenders] = useState<number>(0);
  const [totalCarriers, setTotalCarriers] = useState<number>(0);
  const [totalDeliveries, setTotalDeliveries] = useState<number>(0);
  const [completedRevenue, setCompletedRevenue] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const stats = useMemo(
    () => ({
      totalSenders,
      totalCarriers,
      totalDeliveries,
      revenue: completedRevenue,
      weeklyGrowth: 8.5,
    }),
    [totalSenders, totalCarriers, totalDeliveries, completedRevenue],
  );

  useEffect(() => {
    let active = true;
    const cacheKey = "admin:dashboard-metrics:v1";

    async function loadCounts() {
      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (active && cached) {
            setTotalSenders(Number(cached.totalSenders || 0));
            setTotalCarriers(Number(cached.totalCarriers || 0));
            setTotalDeliveries(Number(cached.totalDeliveries || 0));
            setCompletedRevenue(Number(cached.revenue || 0));
          }
        }
      } catch (error) {
        console.error("Failed to read dashboard metrics cache", error);
      }

      const response = await fetch("/api/admin/dashboard-metrics");

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (!active) {
        return;
      }

      setTotalSenders(Number(data.totalSenders || 0));
      setTotalCarriers(Number(data.totalCarriers || 0));
      setTotalDeliveries(Number(data.totalDeliveries || 0));
      setCompletedRevenue(Number(data.revenue || 0));

      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to write dashboard metrics cache", error);
      }
    }

    loadCounts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const cacheKey = "admin:wallet:v1";

    async function loadWallet() {
      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (active && cached) {
            setWalletBalance(
              cached.wallet_balance !== undefined
                ? Number(cached.wallet_balance)
                : null,
            );
          }
        }
      } catch (error) {
        console.error("Failed to read wallet cache", error);
      }

      try {
        const response = await fetch("/api/admin/wallet");
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!active) {
          return;
        }

        setWalletBalance(
          data.wallet_balance !== undefined ? Number(data.wallet_balance) : 0,
        );

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
          console.error("Failed to write wallet cache", error);
        }
      } catch (error) {
        console.error("Failed to load wallet", error);
      }
    }

    loadWallet();

    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setRecentActivities([
      {
        type: "user_registration",
        id: "1",
        timestamp: new Date().toISOString(),
        data: {
          id: "1",
          role: "carrier",
          full_name: "John Doe",
        },
      },
      {
        type: "transaction",
        id: "2",
        timestamp: new Date().toISOString(),
        data: {
          id: "2",
          amount: 50000,
          type: "payment",
        },
      },
      {
        type: "dispute",
        id: "3",
        timestamp: new Date().toISOString(),
        data: {
          id: "3",
          status: "pending",
          resolution: null,
        },
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard
          </p>
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
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total Sender
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalSenders.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-200">
              Active senders in Supabase
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-500/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Total Carrier
            </CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.totalCarriers.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-200">
              Total active carrier
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 cursor-pointer hover:bg-red-100/50 transition-colors dark:bg-red-500/10 dark:hover:bg-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">
              Total Delivery
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {stats.totalDeliveries.toLocaleString()}
            </div>
            <p className="text-xs text-red-600 dark:text-red-200">
              All recorded transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50/50 cursor-pointer hover:bg-purple-100/50 transition-colors dark:bg-purple-500/10 dark:hover:bg-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              ₦{stats.revenue.toLocaleString()}
            </div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <p className="text-xs text-green-500">
                Total delivery transaction
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-amber-200/70 bg-gradient-to-br from-amber-50 via-background to-emerald-50 dark:from-amber-500/10 dark:via-background dark:to-emerald-500/10">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Admin Wallet
            </CardTitle>
          </div>
          <Link
            href="/admin/dashboard/wallet"
            className="inline-flex items-center rounded-full border border-amber-200/70 bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-amber-300/80"
          >
            View wallet
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-3xl font-bold text-foreground">
              {walletBalance === null
                ? "₦—"
                : `₦${Number(walletBalance).toLocaleString()}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/dashboard/wallet"
              className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition hover:bg-foreground/90"
            >
              Transfer funds
            </Link>
            <Link
              href="/admin/dashboard/transactions"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-foreground/20"
            >
              View payouts
            </Link>
          </div>
        </CardContent>
      </Card>

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
                    <p className="text-sm font-medium">Total Delivery</p>
                    <p className="text-2xl font-bold">
                      {stats.totalDeliveries.toLocaleString()}
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
                        {new Date(activity?.timestamp).toLocaleString()}
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
