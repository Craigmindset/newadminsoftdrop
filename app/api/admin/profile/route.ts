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
  const authUserResult = await supabaseAdmin.auth.getUser(token);

  if (authUserResult.error || !authUserResult.data.user?.id) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 },
    );
  }

  const authUserId = authUserResult.data.user.id;
  const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
    .from("admin_profile")
    .select("id, first_name, last_name, role, is_active")
    .eq("id", authUserId)
    .maybeSingle();

  if (adminProfileError || !adminProfile) {
    return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
  }

  if (adminProfile.is_active === false) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    profile: {
      id: adminProfile.id,
      first_name: adminProfile.first_name || "",
      last_name: adminProfile.last_name || "",
      role: adminProfile.role,
      is_active: adminProfile.is_active,
    },
  });
}
