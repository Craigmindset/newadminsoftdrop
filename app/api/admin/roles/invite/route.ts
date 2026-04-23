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

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization bearer token" },
      { status: 401 },
    );
  }

  const { email, role } = await request
    .json()
    .catch(() => ({ email: "", role: "" }));
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const nextRole = typeof role === "string" ? role : "";

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }

  if (!nextRole || !["super_admin", "manager", "support"].includes(nextRole)) {
    return NextResponse.json(
      { error: "Valid role is required" },
      { status: 400 },
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
  const { data: adminProfile, error: profileError } = await supabaseAdmin
    .from("admin_profile")
    .select("id, role, is_active")
    .eq("id", authUserId)
    .maybeSingle();

  if (profileError || !adminProfile) {
    return NextResponse.json(
      { error: "Admin profile not found" },
      { status: 403 },
    );
  }

  if (adminProfile.is_active === false || adminProfile.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: inviteData, error: inviteError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail);

  if (inviteError || !inviteData?.user?.id) {
    return NextResponse.json(
      { error: inviteError?.message || "Failed to invite admin" },
      { status: 500 },
    );
  }

  const invitedUserId = inviteData.user.id;

  const { error: upsertError } = await supabaseAdmin
    .from("admin_profile")
    .upsert(
      {
        id: invitedUserId,
        email: normalizedEmail,
        role: nextRole,
        is_active: true,
      },
      { onConflict: "id" },
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
