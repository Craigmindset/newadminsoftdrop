import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: deliveries, error } = await supabaseAdmin
    .from("delivery_request")
    .select(
      "id,user_id,carrier_id,route,item_type,delivery_method,status,amount,payment_status,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const deliveryRows = deliveries || [];
  const senderIds = Array.from(
    new Set(deliveryRows.map((row) => row.user_id).filter(Boolean)),
  );
  const carrierIds = Array.from(
    new Set(deliveryRows.map((row) => row.carrier_id).filter(Boolean)),
  );

  const [sendersResult, carriersResult] = await Promise.all([
    senderIds.length
      ? supabaseAdmin
          .from("sender_profile")
          .select("id,user_id,first_name,last_name,email,profile_image")
          .in("user_id", senderIds)
      : Promise.resolve({ data: [], error: null }),
    carrierIds.length
      ? supabaseAdmin
          .from("carrier_profile")
          .select("id,first_name,last_name,email,profile_image")
          .in("id", carrierIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (sendersResult.error || carriersResult.error) {
    return NextResponse.json({ error: "Unable to load transaction parties" }, { status: 500 });
  }

  const senderMap = new Map(
    (sendersResult.data || []).map((sender) => [sender.user_id, sender]),
  );
  const carrierMap = new Map(
    (carriersResult.data || []).map((carrier) => [carrier.id, carrier]),
  );

  const transactions = deliveryRows.map((row) => {
    const sender = senderMap.get(row.user_id) || null;
    const carrier = row.carrier_id ? carrierMap.get(row.carrier_id) || null : null;

    return {
      id: row.id,
      date: row.created_at,
      route: row.route,
      itemType: row.item_type,
      deliveryMethod: row.delivery_method,
      status: row.status,
      paymentStatus: row.payment_status,
      amount: row.amount ?? 0,
      sender: sender
        ? {
            id: sender.user_id || sender.id,
            name: `${sender.first_name || ""} ${sender.last_name || ""}`.trim(),
            email: sender.email,
            avatar: sender.profile_image,
          }
        : null,
      carrier: carrier
        ? {
            id: carrier.id,
            name: `${carrier.first_name || ""} ${carrier.last_name || ""}`.trim(),
            email: carrier.email,
            avatar: carrier.profile_image,
          }
        : null,
    };
  });

  return NextResponse.json({ data: transactions });
}