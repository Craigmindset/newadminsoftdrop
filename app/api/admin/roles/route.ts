import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

function getBearerToken(request: Request) {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization");
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export async function GET(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization bearer token" },
      { status: 401 },
    );
  }

  const supabaseAdmin = getSupabaseAdmin();

  const userResult = await supabaseAdmin.auth.getUser(token);
  if (userResult.error || !userResult.data.user?.id) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 },
    );
  }

  const authUserId = userResult.data.user.id;
  const { data: requestingAdmin, error: profileError } = await supabaseAdmin
    .from("admin_profile")
    .select("id, role, is_active")
    .eq("id", authUserId)
    .maybeSingle();

  if (profileError || !requestingAdmin) {
    return NextResponse.json(
      { error: "Admin profile not found" },
      { status: 403 },
    );
  }

  if (requestingAdmin.is_active === false) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (requestingAdmin.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: admins, error: listError } = await supabaseAdmin
    .from("admin_profile")
    .select("id, email, first_name, last_name, role, is_active, last_login, created_at")
    .order("created_at", { ascending: false });

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  return NextResponse.json({ admins: admins || [] });
}
