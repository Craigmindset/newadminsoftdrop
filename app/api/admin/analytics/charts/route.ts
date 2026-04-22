import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

type MonthBucket = {
  month: string;
  senders?: number;
  carriers?: number;
  value?: number;
  profit?: number;
};

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  const labelDate = new Date(year, month - 1, 1);
  return labelDate.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function buildMonthSeries(keys: string[]) {
  return keys.map((key) => ({ month: monthLabel(key), key }));
}

function lastMonths(count: number) {
  const keys: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(date));
  }
  return keys;
}

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const months = lastMonths(6);
  const monthSeries = buildMonthSeries(months);

  const [sendersResult, carriersResult, deliveriesResult] = await Promise.all([
    supabaseAdmin.from("sender_profile").select("created_at"),
    supabaseAdmin.from("carrier_profile").select("created_at"),
    supabaseAdmin
      .from("delivery_request")
      .select("created_at,amount,delivery_commission,delivery_method,route,status,carrier_id"),
  ]);

  if (sendersResult.error || carriersResult.error || deliveriesResult.error) {
    return NextResponse.json(
      { error: "Failed to load analytics data." },
      { status: 500 },
    );
  }

  const senderRows = sendersResult.data || [];
  const carrierRows = carriersResult.data || [];
  const deliveryRows = deliveriesResult.data || [];

  const userGrowth: MonthBucket[] = monthSeries.map((entry) => ({
    month: entry.month,
    senders: 0,
    carriers: 0,
  }));

  const senderCounts = new Map<string, number>();
  senderRows.forEach((row) => {
    if (!row.created_at) return;
    const key = monthKey(new Date(row.created_at));
    senderCounts.set(key, (senderCounts.get(key) || 0) + 1);
  });

  const carrierCounts = new Map<string, number>();
  carrierRows.forEach((row) => {
    if (!row.created_at) return;
    const key = monthKey(new Date(row.created_at));
    carrierCounts.set(key, (carrierCounts.get(key) || 0) + 1);
  });

  userGrowth.forEach((bucket, index) => {
    const key = months[index];
    bucket.senders = senderCounts.get(key) || 0;
    bucket.carriers = carrierCounts.get(key) || 0;
  });

  const userType = {
    senders: senderRows.length,
    carriers: carrierRows.length,
  };

  const transactionVolume: MonthBucket[] = monthSeries.map((entry) => ({
    month: entry.month,
    value: 0,
  }));

  const profitSeries: MonthBucket[] = monthSeries.map((entry) => ({
    month: entry.month,
    profit: 0,
  }));

  const deliveryTypeCounts = new Map<string, number>();
  const routeCounts = new Map<string, number>();
  const statusCounts = new Map<string, number>();
  const carrierCountsById = new Map<string, number>();

  deliveryRows.forEach((row) => {
    const createdAt = row.created_at ? new Date(row.created_at) : null;
    if (createdAt) {
      const key = monthKey(createdAt);
      if (months.includes(key) && row.status === "completed") {
        const idx = months.indexOf(key);
        transactionVolume[idx].value =
          (transactionVolume[idx].value || 0) + Number(row.amount || 0);
      }
      if (months.includes(key)) {
        const idx = months.indexOf(key);
        profitSeries[idx].profit =
          (profitSeries[idx].profit || 0) +
          Number(row.delivery_commission || 0);
      }
    }

    const type = String(row.delivery_method || "unknown");
    deliveryTypeCounts.set(type, (deliveryTypeCounts.get(type) || 0) + 1);

    const route = String(row.route || "unknown");
    routeCounts.set(route, (routeCounts.get(route) || 0) + 1);

    const status = String(row.status || "unknown");
    statusCounts.set(status, (statusCounts.get(status) || 0) + 1);

    if (row.carrier_id) {
      carrierCountsById.set(
        row.carrier_id,
        (carrierCountsById.get(row.carrier_id) || 0) + 1,
      );
    }
  });

  const topCarriers = Array.from(carrierCountsById.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const carrierIds = topCarriers.map(([id]) => id);
  const carrierProfiles = carrierIds.length
    ? await supabaseAdmin
        .from("carrier_profile")
        .select("id,first_name,last_name")
        .in("id", carrierIds)
    : { data: [], error: null };

  const carrierNameMap = new Map(
    (carrierProfiles.data || []).map((row) => [
      row.id,
      `${row.first_name || ""} ${row.last_name || ""}`.trim() || "Carrier",
    ]),
  );

  const carrierPerformance = topCarriers.map(([id, deliveries]) => ({
    name: carrierNameMap.get(id) || "Carrier",
    deliveries,
  }));

  return NextResponse.json({
    userGrowth,
    userType,
    transactionVolume,
    profitSeries,
    deliveryTypes: Array.from(deliveryTypeCounts.entries()).map(([name, value]) => ({
      name,
      value,
    })),
    routeDistribution: Array.from(routeCounts.entries()).map(([name, transactions]) => ({
      name,
      transactions,
    })),
    statusDistribution: Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
    })),
    carrierPerformance,
  });
}
