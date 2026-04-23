import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();

  const [senderCountResult, carrierCountResult] = await Promise.all([
    supabaseAdmin
      .from("sender_profile")
      .select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("carrier_profile")
      .select("id", { count: "exact", head: true }),
  ]);

  if (senderCountResult.error || carrierCountResult.error) {
    return NextResponse.json(
      { error: "Failed to load user counts." },
      { status: 500 },
    );
  }

  const totalUsers =
    (senderCountResult.count || 0) + (carrierCountResult.count || 0);

  const deliveryResult = await supabaseAdmin
    .from("delivery_request")
    .select("amount,delivery_commission,status");

  if (deliveryResult.error) {
    return NextResponse.json(
      { error: "Failed to load delivery totals." },
      { status: 500 },
    );
  }

  const deliveryRows = deliveryResult.data || [];
  const deliveryAmount = deliveryRows
    .filter((row) => row.status === "completed")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const deliveryCommission = deliveryRows.reduce(
    (sum, row) => sum + Number(row.delivery_commission || 0),
    0,
  );

  const airtimeResult = await supabaseAdmin
    .from("airtime_transactions")
    .select("amount");

  if (airtimeResult.error) {
    console.warn("Failed to load airtime totals", airtimeResult.error);
  }

  if (airtimeResult.error) {
    return NextResponse.json(
      { error: "Failed to load airtime totals." },
      { status: 500 },
    );
  }

  const airtimeAmount = (airtimeResult.data || []).reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0,
  );

  return NextResponse.json({
    totalUsers,
    transactionVolume: deliveryAmount + airtimeAmount,
    totalProfit: deliveryCommission,
  });
}
