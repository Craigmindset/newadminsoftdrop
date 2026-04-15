import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();

  const [senders, carriers, deliveries] = await Promise.all([
    supabaseAdmin
      .from("sender_profile")
      .select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("carrier_profile")
      .select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("delivery_request")
      .select("id", { count: "exact", head: true }),
  ]);

  const { data: completed, error: completedError } = await supabaseAdmin
    .from("delivery_request")
    .select("amount")
    .eq("status", "completed");

  if (senders.error || carriers.error || deliveries.error) {
    return NextResponse.json(
      { error: "Unable to load dashboard metrics" },
      { status: 500 },
    );
  }

  let revenueTotal = 0;
  if (!completedError && completed) {
    revenueTotal = completed.reduce((sum, row) => {
      const amount =
        typeof row.amount === "number" ? row.amount : Number(row.amount || 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }

  return NextResponse.json({
    totalSenders: senders.count || 0,
    totalCarriers: carriers.count || 0,
    totalDeliveries: deliveries.count || 0,
    revenue: revenueTotal,
  });
}
