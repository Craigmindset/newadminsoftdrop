import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const { data: carrier, error } = await supabaseAdmin
    .from("carrier_profile")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!carrier) {
    return NextResponse.json({ error: "Carrier not found" }, { status: 404 });
  }

  let totalDeliveries = 0;
  let totalEarned = 0;

  if (carrier.id) {
    const deliveries = await supabaseAdmin
      .from("delivery_request")
      .select("amount", { count: "exact" })
      .eq("carrier_id", carrier.id)
      .eq("status", "completed");

    if (!deliveries.error) {
      totalDeliveries = deliveries.count || 0;
      totalEarned = (deliveries.data || []).reduce((sum, row) => {
        const amount =
          typeof row.amount === "number" ? row.amount : Number(row.amount || 0);
        return sum + (Number.isFinite(amount) ? amount : 0);
      }, 0);
    }
  }

  return NextResponse.json({
    data: carrier,
    totals: {
      totalDeliveries,
      totalEarned,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  const adminCheck = payload?.admin_check;

  if (typeof adminCheck !== "boolean") {
    return NextResponse.json(
      { error: "admin_check must be boolean" },
      { status: 400 },
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("carrier_profile")
    .update({ admin_check: adminCheck })
    .eq("id", id)
    .select("admin_check")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Carrier not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
