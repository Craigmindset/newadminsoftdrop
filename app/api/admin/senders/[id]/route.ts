import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const { data: sender, error } = await supabaseAdmin
    .from("sender_profile")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!sender) {
    return NextResponse.json({ error: "Sender not found" }, { status: 404 });
  }

  let totalRequests = 0;
  let totalSpent = 0;

  const senderKey = sender.user_id || sender.id;
  if (senderKey) {
    const deliveries = await supabaseAdmin
      .from("delivery_request")
      .select("amount", { count: "exact" })
      .eq("user_id", senderKey)
      .eq("status", "completed");

    if (!deliveries.error) {
      totalRequests = deliveries.count || 0;
      totalSpent = (deliveries.data || []).reduce((sum, row) => {
        const amount = typeof row.amount === "number" ? row.amount : Number(row.amount || 0);
        return sum + (Number.isFinite(amount) ? amount : 0);
      }, 0);
    }
  }

  return NextResponse.json({
    data: sender,
    totals: {
      totalRequests,
      totalSpent,
    },
  });
}
