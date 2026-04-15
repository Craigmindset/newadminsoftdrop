import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

export async function GET(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("carrier_profile")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}
