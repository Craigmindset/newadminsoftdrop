import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

const MIN_PASSWORD_LENGTH = 8;

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

  const { email, password } = await request
    .json()
    .catch(() => ({ email: "", password: "" }));
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const nextPassword = typeof password === "string" ? password : "";

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }

  if (nextPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
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

  const { data: targetUser, error: lookupError } =
    await supabaseAdmin.auth.admin.getUserByEmail(normalizedEmail);
  if (lookupError || !targetUser?.user) {
    return NextResponse.json(
      { error: "Target user not found" },
      { status: 404 },
    );
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    targetUser.user.id,
    {
      password: nextPassword,
    },
  );

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
