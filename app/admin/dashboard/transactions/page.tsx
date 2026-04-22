"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const TRANSACTIONS_CACHE_KEY = "admin:transactions:v1";
const TRANSACTIONS_CACHE_TTL_MS = 5 * 60 * 1000;

// Calculate financial metrics
const calculateMetrics = (transactions: typeof mockTransactions) => {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, trx) => sum + trx.amount, 0);
  const totalCommission = transactions.reduce(
    (sum, trx) => sum + trx.commission,
    0
  );
  const completedTransactions = transactions.filter(
    (trx) => trx.status === "completed"
  );
  const completedAmount = completedTransactions.reduce(
    (sum, trx) => sum + trx.amount,
    0
  );
  const completedCommission = completedTransactions.reduce(
    (sum, trx) => sum + trx.commission,
    0
  );

  return {
    totalTransactions,
    totalAmount,
    totalCommission,
    completedTransactions: completedTransactions.length,
    completedAmount,
    completedCommission,
    averageTransaction:
      totalTransactions > 0 ? totalAmount / totalTransactions : 0,
    averageCommission:
      totalTransactions > 0 ? totalCommission / totalTransactions : 0,
  };
};

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionType, setTransactionType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let active = true;
    let usedCache = false;

    async function loadTransactions() {
      try {
        const cachedRaw = sessionStorage.getItem(TRANSACTIONS_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (
            cached?.data &&
            cached?.timestamp &&
            Date.now() - cached.timestamp < TRANSACTIONS_CACHE_TTL_MS
          ) {
            setTransactions(cached.data || []);
            setLoading(false);
            usedCache = true;
          }
        }
      } catch (error) {
        console.error("Failed to read transactions cache", error);
      }

      if (!usedCache) {
        setLoading(true);
      }

      const response = await fetch("/api/admin/transactions");
      if (!response.ok) {
        if (!usedCache) {
          setLoading(false);
        }
        return;
      }

      const payload = await response.json();
      if (!active) {
        return;
      }

      const nextData = payload.data || [];
      setTransactions(nextData);
      setLoading(false);

      try {
        sessionStorage.setItem(
          TRANSACTIONS_CACHE_KEY,
          JSON.stringify({ data: nextData, timestamp: Date.now() }),
        );
      } catch (error) {
        console.error("Failed to write transactions cache", error);
      }
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, []);

  // Filter transactions based on filters
  const filteredTransactions = useMemo(() =>
    transactions.filter((transaction) => {
      const matchesType =
        transactionType === "all" || transaction.route === transactionType;
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;
      const senderName = String(transaction?.sender?.name || "").toLowerCase();
      const carrierName = String(transaction?.carrier?.name || "").toLowerCase();
      const matchesSearch =
        String(transaction.id || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        senderName.includes(searchQuery.toLowerCase()) ||
        carrierName.includes(searchQuery.toLowerCase());

      let matchesTimeframe = true;
      const createdAt = transaction.date ? new Date(transaction.date) : null;
      if (createdAt) {
        if (timeframe === "today") {
          matchesTimeframe =
            createdAt.toDateString() === new Date().toDateString();
        } else if (timeframe === "week") {
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTimeframe = createdAt >= weekAgo;
        } else if (timeframe === "month") {
          const now = new Date();
          const monthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          matchesTimeframe = createdAt >= monthAgo;
        }
      }

      return matchesType && matchesStatus && matchesSearch && matchesTimeframe;
    }),
    [searchQuery, statusFilter, timeframe, transactionType, transactions],
  );

  // Calculate metrics for filtered transactions
  const metrics = useMemo(() => {
    const completedTransactions = filteredTransactions.filter(
      (trx) => trx.status === "completed",
    );
    const totalTransactions = completedTransactions.length;
    const totalAmount = filteredTransactions.reduce(
      (sum, trx) => sum + Number(trx.amount || 0),
      0,
    );
    const totalCommission = filteredTransactions.reduce(
      (sum, trx) => sum + Number(trx.deliveryCommission || 0),
      0,
    );
    const completedAmount = completedTransactions.reduce(
      (sum, trx) => sum + Number(trx.amount || 0),
      0,
    );
    const completedCommission = completedTransactions.reduce(
      (sum, trx) => sum + Number(trx.deliveryCommission || 0),
      0,
    );
    const averageCommission =
      filteredTransactions.length > 0
        ? totalCommission / filteredTransactions.length
        : 0;

    return {
      totalTransactions,
      totalAmount,
      totalCommission,
      completedTransactions: completedTransactions.length,
      completedAmount,
      completedCommission,
      averageTransaction:
        totalTransactions > 0 ? totalAmount / totalTransactions : 0,
      averageCommission,
    };
  }, [filteredTransactions]);

  const handleViewTransaction = (id: string) => {
    router.push(`/admin/dashboard/transactions/${id}`);
  };

  const handleExportPdf = async () => {
    const [{ jsPDF }, autoTableModule] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const autoTable = autoTableModule.default;
    const doc = new jsPDF({ orientation: "landscape" });

    const completedCount = filteredTransactions.filter(
      (trx) => trx.status === "completed",
    ).length;
    const pendingCancelCount = filteredTransactions.filter(
      (trx) => trx.status === "pending" || trx.status === "cancelled",
    ).length;
    const dates = filteredTransactions
      .map((trx) => (trx.date ? new Date(trx.date) : null))
      .filter((value): value is Date => value instanceof Date);
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const durationStart = sortedDates[0]
      ? sortedDates[0].toLocaleDateString()
      : "-";
    const durationEnd = sortedDates[sortedDates.length - 1]
      ? sortedDates[sortedDates.length - 1].toLocaleDateString()
      : "-";

    doc.setFontSize(16);
    doc.text("SoftDrop Transaction Table", 14, 16);
    doc.setFontSize(10);
    doc.text(
      `Transaction Summary: Total Delivery ${filteredTransactions.length} | Completed Delivery ${completedCount} | Pending/Cancel Delivery ${pendingCancelCount} | Duration ${durationStart} to ${durationEnd}`,
      14,
      22,
    );

    const rows = filteredTransactions.map((transaction) => [
      String(transaction.id || "").slice(-7),
      transaction.date ? new Date(transaction.date).toLocaleString() : "-",
      transaction.sender?.name || "-",
      transaction.carrier?.name || "-",
      `₦${Number(transaction.amount || 0).toLocaleString()}`,
      `₦${Number(transaction.deliveryCommission || 0).toLocaleString()}`,
      transaction.status
        ? transaction.status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())
        : "-",
    ]);

    autoTable(doc, {
      head: [[
        "Package ID",
        "Date",
        "Sender",
        "Carrier",
        "Amount",
        "Commission",
        "Status",
      ]],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 41, 59] },
      margin: { top: 30, left: 14, right: 14 },
      startY: 30,
    });

    doc.save(`transactions-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-gray-500">
          Manage and monitor all platform transactions
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalTransactions}
            </div>
            <p className="text-xs text-gray-500">
              Completed deliveries
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaction Volume
            </CardTitle>
            <ArrowDownUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{metrics.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Avg: ₦{Math.round(metrics.averageTransaction).toLocaleString()}{" "}
              per transaction
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{metrics.totalCommission.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">From delivery commission</p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Commission
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{Math.round(metrics.averageCommission).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Average per delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="inter">Interstate</SelectItem>
            <SelectItem value="intra">Intracity</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full md:w-[260px] pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <Calendar className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="gap-2 transition-opacity active:opacity-70"
            onClick={handleExportPdf}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Package ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Sender
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Carrier
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Commission
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium">
                        {String(transaction.id || "").slice(-7)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {transaction.date
                          ? new Date(transaction.date).toLocaleString()
                          : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              transaction.sender?.avatar ||
                              `/placeholder.svg?height=24&width=24&text=${
                                transaction.sender?.name?.charAt(0) || "?"
                              }`
                            }
                          />
                          <AvatarFallback>
                            {transaction.sender?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {transaction.sender?.name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              transaction.carrier?.avatar ||
                              `/placeholder.svg?height=24&width=24&text=${
                                transaction.carrier?.name?.charAt(0) || "?"
                              }`
                            }
                          />
                          <AvatarFallback>
                            {transaction.carrier?.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {transaction.carrier?.name || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">
                        ₦{Number(transaction.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-green-600">
                        ₦
                        {Number(
                          transaction.deliveryCommission || 0,
                        ).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {transaction.status
                          ? transaction.status
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c: string) =>
                                c.toUpperCase(),
                              )
                          : "-"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleViewTransaction(transaction.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Breakdown</CardTitle>
          <CardDescription>
            Analysis of commission earned from transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Completed Transactions
                  </span>
                  <span className="text-sm">
                    {metrics.completedTransactions} /{" "}
                    {metrics.totalTransactions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        metrics.totalTransactions > 0
                          ? (metrics.completedTransactions /
                              metrics.totalTransactions) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Commission Earned</span>
                  <span className="text-sm">
                    ₦{metrics.completedCommission.toLocaleString()} / ₦
                    {metrics.totalCommission.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        metrics.totalCommission > 0
                          ? (metrics.completedCommission /
                              metrics.totalCommission) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-1">
                  Intracity Transactions
                </h3>
                <div className="text-2xl font-bold">
                  {filteredTransactions.filter((t) => t.route === "intra")
                    .length}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Commission: ₦
                  {filteredTransactions
                    .filter((t) => t.route === "intra")
                    .reduce(
                      (sum, t) => sum + Number(t.deliveryCommission || 0),
                      0,
                    )
                    .toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-1">
                  Interstate Transactions
                </h3>
                <div className="text-2xl font-bold">
                  {filteredTransactions.filter((t) => t.route === "inter")
                    .length}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Commission: ₦
                  {filteredTransactions
                    .filter((t) => t.route === "inter")
                    .reduce(
                      (sum, t) => sum + Number(t.deliveryCommission || 0),
                      0,
                    )
                    .toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Average Commission</h3>
                <div className="text-2xl font-bold">
                  ₦{Math.round(metrics.averageCommission).toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Across filtered transactions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
