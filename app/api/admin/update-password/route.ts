import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseClient } from "@/lib/supabase-client";

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

  const { currentPassword, newPassword, firstName, lastName } = await request
    .json()
    .catch(() => ({
      currentPassword: "",
      newPassword: "",
      firstName: "",
      lastName: "",
    }));

  const current =
    typeof currentPassword === "string" ? currentPassword : "";
  const next = typeof newPassword === "string" ? newPassword : "";
  const sanitizedFirstName =
    typeof firstName === "string" ? firstName.trim() : "";
  const sanitizedLastName = typeof lastName === "string" ? lastName.trim() : "";

  if (!current || !next) {
    return NextResponse.json(
      { error: "Current and new password are required" },
      { status: 400 },
    );
  }

  if (next.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (!sanitizedFirstName || !sanitizedLastName) {
    return NextResponse.json(
      { error: "First name and last name are required" },
      { status: 400 },
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

  const authUser = authUserResult.data.user;
  if (!authUser.email) {
    return NextResponse.json(
      { error: "Unable to resolve admin email" },
      { status: 400 },
    );
  }

  const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
    .from("admin_profile")
    .select("id, is_active")
    .eq("id", authUser.id)
    .maybeSingle();

  if (adminProfileError || !adminProfile || adminProfile.is_active === false) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const verifyClient = getSupabaseClient();
  const { error: verifyError } = await verifyClient.auth.signInWithPassword({
    email: authUser.email,
    password: current,
  });

  if (verifyError) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  await verifyClient.auth.signOut();

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    authUser.id,
    {
      password: next,
    },
  );

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { error: profileUpdateError } = await supabaseAdmin
    .from("admin_profile")
    .update({
      first_name: sanitizedFirstName,
      last_name: sanitizedLastName,
    })
    .eq("id", authUser.id);

  if (profileUpdateError) {
    return NextResponse.json(
      { error: profileUpdateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
