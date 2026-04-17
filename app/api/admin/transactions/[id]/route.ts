import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: delivery, error } = await supabaseAdmin
    .from("delivery_request")
    .select(
      "id,user_id,carrier_id,route,item_type,quantity,package_image,receiver_name,receiver_contact,receiver_pin,sender_name,sender_contact,delivery_method,is_insured,status,pickup_location,dropoff_location,created_at,updated_at,amount,payment_status,requested_carriage_type,matched_carrier_ids,matched_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!delivery) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const [senderProfileResult, carrierProfileResult] = await Promise.all([
    delivery.user_id
      ? supabaseAdmin
          .from("sender_profile")
          .select("id,user_id,first_name,last_name,email,phone_number,profile_image")
          .eq("user_id", delivery.user_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    delivery.carrier_id
      ? supabaseAdmin
          .from("carrier_profile")
          .select("id,first_name,last_name,email,phone_number,profile_image")
          .eq("id", delivery.carrier_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (senderProfileResult.error || carrierProfileResult.error) {
    return NextResponse.json(
      { error: "Unable to load transaction parties" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      delivery,
      sender: senderProfileResult.data || null,
      carrier: carrierProfileResult.data || null,
    },
  });
}