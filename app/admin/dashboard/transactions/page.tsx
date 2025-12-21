"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownUp,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Filter,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Mock transaction data
const mockTransactions = [
  {
    id: "TRX-12345",
    date: "2023-09-15T14:30:00",
    sender: {
      id: "SND-001",
      name: "John Doe",
      email: "john@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: null,
    },
    amount: 2500,
    commission: 375, // 15% of 2500
    status: "completed",
    type: "intracity",
    paymentMethod: "wallet",
    itemType: "document",
  },
  {
    id: "TRX-12346",
    date: "2023-09-15T12:15:00",
    sender: {
      id: "SND-002",
      name: "Emily Wilson",
      email: "emily@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-002",
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: null,
    },
    amount: 3500,
    commission: 525, // 15% of 3500
    status: "completed",
    type: "interstate",
    paymentMethod: "card",
    itemType: "package",
  },
  {
    id: "TRX-12347",
    date: "2023-09-15T10:45:00",
    sender: {
      id: "SND-003",
      name: "Robert Smith",
      email: "robert@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-003",
      name: "Jessica Lee",
      email: "jessica@example.com",
      avatar: null,
    },
    amount: 1800,
    commission: 270, // 15% of 1800
    status: "in-transit",
    type: "intracity",
    paymentMethod: "wallet",
    itemType: "document",
  },
  {
    id: "TRX-12348",
    date: "2023-09-14T16:20:00",
    sender: {
      id: "SND-004",
      name: "David Clark",
      email: "david@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-004",
      name: "Amanda Wilson",
      email: "amanda@example.com",
      avatar: null,
    },
    amount: 4200,
    commission: 630, // 15% of 4200
    status: "completed",
    type: "interstate",
    paymentMethod: "card",
    itemType: "fragile",
  },
  {
    id: "TRX-12349",
    date: "2023-09-14T09:10:00",
    sender: {
      id: "SND-005",
      name: "Jennifer Adams",
      email: "jennifer@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-005",
      name: "Daniel Johnson",
      email: "daniel@example.com",
      avatar: null,
    },
    amount: 2200,
    commission: 330, // 15% of 2200
    status: "cancelled",
    type: "intracity",
    paymentMethod: "wallet",
    itemType: "document",
  },
  {
    id: "TRX-12350",
    date: "2023-09-13T15:40:00",
    sender: {
      id: "SND-001",
      name: "John Doe",
      email: "john@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-002",
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: null,
    },
    amount: 3000,
    commission: 450, // 15% of 3000
    status: "completed",
    type: "interstate",
    paymentMethod: "card",
    itemType: "package",
  },
  {
    id: "TRX-12351",
    date: "2023-09-13T11:25:00",
    sender: {
      id: "SND-002",
      name: "Emily Wilson",
      email: "emily@example.com",
      avatar: null,
    },
    carrier: {
      id: "CAR-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: null,
    },
    amount: 1500,
    commission: 225, // 15% of 1500
    status: "pending",
    type: "intracity",
    paymentMethod: "wallet",
    itemType: "document",
  },
];

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
  const [transactionType, setTransactionType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter transactions based on filters
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesType =
      transactionType === "all" || transaction.type === transactionType;
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.carrier.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Simple timeframe filter (in a real app, you'd use proper date filtering)
    let matchesTimeframe = true;
    if (timeframe === "today") {
      matchesTimeframe =
        new Date(transaction.date).toDateString() === new Date().toDateString();
    } else if (timeframe === "week") {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesTimeframe = new Date(transaction.date) >= weekAgo;
    } else if (timeframe === "month") {
      const now = new Date();
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      matchesTimeframe = new Date(transaction.date) >= monthAgo;
    }

    return matchesType && matchesStatus && matchesSearch && matchesTimeframe;
  });

  // Calculate metrics for filtered transactions
  const metrics = calculateMetrics(filteredTransactions);

  const handleViewTransaction = (id: string) => {
    router.push(`/admin/dashboard/transactions/${id}`);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
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
              {metrics.completedTransactions} completed
            </p>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
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
            <p className="text-xs text-gray-500">5% of transaction volume</p>
          </CardContent>
        </Card>

        <Card>
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
            <p className="text-xs text-gray-500">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Tabs
          defaultValue="all"
          className="w-full md:w-auto"
          onValueChange={setTransactionType}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="intracity">Intracity</TabsTrigger>
            <TabsTrigger value="interstate">Interstate</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full md:w-[200px] pl-9"
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
              <SelectItem value="in-transit">In Transit</SelectItem>
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

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="gap-2">
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
                    Transaction ID
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
                    Commission (15%)
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
                      <span className="font-medium">{transaction.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {new Date(transaction.date).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              transaction.sender.avatar ||
                              `/placeholder.svg?height=24&width=24&text=${transaction.sender.name.charAt(
                                0
                              )}`
                            }
                          />
                          <AvatarFallback>
                            {transaction.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {transaction.sender.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              transaction.carrier.avatar ||
                              `/placeholder.svg?height=24&width=24&text=${transaction.carrier.name.charAt(
                                0
                              )}`
                            }
                          />
                          <AvatarFallback>
                            {transaction.carrier.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {transaction.carrier.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">
                        ₦{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-green-600">
                        ₦{transaction.commission.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "in-transit"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
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
                  {
                    filteredTransactions.filter((t) => t.type === "intracity")
                      .length
                  }
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Commission: ₦
                  {filteredTransactions
                    .filter((t) => t.type === "intracity")
                    .reduce((sum, t) => sum + t.commission, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-1">
                  Interstate Transactions
                </h3>
                <div className="text-2xl font-bold">
                  {
                    filteredTransactions.filter((t) => t.type === "interstate")
                      .length
                  }
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Commission: ₦
                  {filteredTransactions
                    .filter((t) => t.type === "interstate")
                    .reduce((sum, t) => sum + t.commission, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-1">Commission Rate</h3>
                <div className="text-2xl font-bold">5%</div>
                <p className="text-sm text-gray-500 mt-1">
                  Of total transaction value
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
