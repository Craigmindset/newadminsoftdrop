export type AdminDashboardStats = {
  totalUsers: number;
  activeCarriers: number;
  activeSenders: number;
  pendingDisputes: number;
  totalTransactions: number;
  revenue: number;
  weeklyGrowth: number;
};

export type DisputeStats = {
  total: number;
  pending: number;
  inReview: number;
  resolved: number;
  byType: {
    [key: string]: number;
  };
  resolutionRate: number;
};

export type TimeframeOption = "daily" | "weekly" | "monthly";

export function getAdminDashboardStats() {
  // Return mock data - replace with actual API calls
  return {
    totalUsers: 1250,
    activeCarriers: 340,
    activeSenders: 910,
    pendingDisputes: 23,
    totalTransactions: 5680,
    revenue: 284000,
    weeklyGrowth: 8.5,
  };
}

export function getDisputeStatistics(
  timeframe: TimeframeOption
) {
  // Return mock data - replace with actual API calls
  return {
    total: 48,
    pending: 23,
    inReview: 15,
    resolved: 10,
    byType: {
      payment_mismatch: 18,
      damaged_item: 12,
      missing_item: 10,
      delivery_delay: 8,
    },
    resolutionRate: 21,
  };
}

export async function getRecentActivity(limit = 5) {
  // Return mock data - replace with actual API calls
  return [
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
  ];
}
