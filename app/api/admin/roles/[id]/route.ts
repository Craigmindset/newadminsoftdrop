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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization bearer token" },
      { status: 401 },
    );
  }

  const { id: targetAdminId } = await context.params;
  if (!targetAdminId) {
    return NextResponse.json({ error: "Admin id is required" }, { status: 400 });
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

  if (requestingAdmin.is_active === false || requestingAdmin.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (authUserId === targetAdminId) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account" },
      { status: 400 },
    );
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    targetAdminId,
  );

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
