import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

type DebugPayload = {
  email?: string;
  success?: boolean;
  error?: string;
  errorCode?: string;
  errorStatus?: number;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as DebugPayload;

  let authUserExists: boolean | null = null;
  let adminProfileExists: boolean | null = null;
  let adminRole: string | null = null;
  let adminIsActive: boolean | null = null;
  let authLookupError: string | null = null;
  let authLookupStatus: number | null = null;
  let authLookupCode: string | null = null;
  let profileLookupError: string | null = null;

  const normalizedEmail = (payload.email || "").trim().toLowerCase();

  if (normalizedEmail && payload.success === false) {
    try {
      const supabaseAdmin = getSupabaseAdmin();

      const { data: adminProfile, error: adminProfileError } = await supabaseAdmin
        .from("admin_profile")
        .select("id, role, is_active")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (adminProfileError) {
        adminProfileExists = null;
        profileLookupError =
          adminProfileError.message || "Unknown admin_profile lookup error";
      } else {
        adminProfileExists = Boolean(adminProfile);
        adminRole = adminProfile?.role || null;
        adminIsActive =
          typeof adminProfile?.is_active === "boolean"
            ? adminProfile.is_active
            : null;
        // This gives better visibility when sign-in fails inside GoTrue.
        const { data: usersData, error: authLookup } =
          await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });

        if (authLookup) {
          authUserExists = null;
          authLookupError = authLookup.message || "Unknown auth lookup error";
          authLookupStatus = (authLookup as any).status || null;
          authLookupCode = (authLookup as any).code || null;
        } else {
          const matched = usersData.users.some(
            (user) => user.email?.toLowerCase() === normalizedEmail,
          );
          authUserExists = matched;
        }
      }
    } catch {
      authUserExists = null;
      adminProfileExists = null;
      adminRole = null;
      adminIsActive = null;
      authLookupError = authLookupError || "Unexpected login-debug exception";
      authLookupStatus = authLookupStatus || null;
      authLookupCode = authLookupCode || null;
      profileLookupError =
        profileLookupError || "Unexpected login-debug exception";
    }
  }

  console.log("[admin login debug]", {
    email: payload.email || "",
    success: Boolean(payload.success),
    error: payload.error || "",
    errorCode: payload.errorCode || "",
    errorStatus: payload.errorStatus ?? null,
    authUserExists,
    adminProfileExists,
    adminRole,
    adminIsActive,
    authLookupError,
    authLookupStatus,
    authLookupCode,
    profileLookupError,
  });

  return NextResponse.json({ ok: true });
}
