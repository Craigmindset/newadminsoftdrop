import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-client";

const ALLOWED_SCOPES = ["global", "intra", "inter", "international"] as const;
const ALLOWED_COMMISSION_TYPES = ["percent", "fixed"] as const;
const ALLOWED_CARRIAGE_TYPES = [
  "car",
  "bike",
  "bicycle",
  "walker",
  "motor-cycle",
  "truck",
] as const;

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

async function requireSuperAdmin(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Missing Authorization bearer token" },
        { status: 401 },
      ),
      supabaseAdmin: null,
      authUserId: null,
    };
  }

  const supabaseAdmin = getSupabaseAdmin();

  const userResult = await supabaseAdmin.auth.getUser(token);
  if (userResult.error || !userResult.data.user?.id) {
    return {
      error: NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      ),
      supabaseAdmin: null,
      authUserId: null,
    };
  }

  const authUserId = userResult.data.user.id;
  const { data: adminProfile, error: profileError } = await supabaseAdmin
    .from("admin_profile")
    .select("id, role, is_active")
    .eq("id", authUserId)
    .maybeSingle();

  if (profileError || !adminProfile) {
    return {
      error: NextResponse.json(
        { error: "Admin profile not found" },
        { status: 403 },
      ),
      supabaseAdmin: null,
      authUserId: null,
    };
  }

  if (adminProfile.is_active === false || adminProfile.role !== "super_admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      supabaseAdmin: null,
      authUserId: null,
    };
  }

  return { error: null, supabaseAdmin, authUserId };
}

export async function GET(request: Request) {
  const auth = await requireSuperAdmin(request);
  if (auth.error || !auth.supabaseAdmin) {
    return auth.error;
  }

  const { data, error } = await auth.supabaseAdmin
    .from("commission_settings")
    .select(
      "id, route_scope, carriage_type, commission_type, commission_value, is_active, effective_from, effective_to, priority, notes, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ commissionSettings: data || [] });
}

export async function POST(request: Request) {
  const auth = await requireSuperAdmin(request);
  if (auth.error || !auth.supabaseAdmin || !auth.authUserId) {
    return auth.error;
  }

  const body = await request.json().catch(() => ({}));
  const commissionId = typeof body.id === "string" ? body.id.trim() : "";
  const routeScope =
    typeof body.route_scope === "string"
      ? body.route_scope.trim().toLowerCase()
      : "global";
  const carriageTypeInput =
    typeof body.carriage_type === "string"
      ? body.carriage_type.trim().toLowerCase()
      : "";
  const carriageType = carriageTypeInput === "" ? null : carriageTypeInput;
  const commissionType =
    typeof body.commission_type === "string"
      ? body.commission_type.trim().toLowerCase()
      : "percent";
  const commissionValue = Number(body.commission_value);
  const isActive = typeof body.is_active === "boolean" ? body.is_active : true;
  const effectiveFromRaw =
    typeof body.effective_from === "string" ? body.effective_from : "";
  const effectiveToRaw =
    typeof body.effective_to === "string" ? body.effective_to : "";
  const priority = Number.isFinite(Number(body.priority))
    ? Number(body.priority)
    : 100;
  const notes = typeof body.notes === "string" ? body.notes.trim() : null;

  if (!ALLOWED_SCOPES.includes(routeScope as (typeof ALLOWED_SCOPES)[number])) {
    return NextResponse.json(
      { error: "Invalid route_scope" },
      { status: 400 },
    );
  }

  if (
    carriageType !== null &&
    !ALLOWED_CARRIAGE_TYPES.includes(
      carriageType as (typeof ALLOWED_CARRIAGE_TYPES)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Invalid carriage_type" },
      { status: 400 },
    );
  }

  if (
    !ALLOWED_COMMISSION_TYPES.includes(
      commissionType as (typeof ALLOWED_COMMISSION_TYPES)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Invalid commission_type" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(commissionValue) || commissionValue < 0) {
    return NextResponse.json(
      { error: "commission_value must be a non-negative number" },
      { status: 400 },
    );
  }

  const effectiveFrom = effectiveFromRaw
    ? new Date(effectiveFromRaw).toISOString()
    : new Date().toISOString();

  if (Number.isNaN(new Date(effectiveFrom).getTime())) {
    return NextResponse.json(
      { error: "Invalid effective_from date" },
      { status: 400 },
    );
  }

  const effectiveTo = effectiveToRaw ? new Date(effectiveToRaw).toISOString() : null;
  if (effectiveToRaw && (!effectiveTo || Number.isNaN(new Date(effectiveTo).getTime()))) {
    return NextResponse.json(
      { error: "Invalid effective_to date" },
      { status: 400 },
    );
  }

  let targetId = commissionId;

  if (!targetId) {
    const { data: existing } = await auth.supabaseAdmin
      .from("commission_settings")
      .select("id")
      .eq("route_scope", routeScope)
      .is("carriage_type", carriageType)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    targetId = existing?.id || "";
  }

  const payload = {
    route_scope: routeScope,
    carriage_type: carriageType,
    commission_type: commissionType,
    commission_value: commissionValue,
    is_active: isActive,
    effective_from: effectiveFrom,
    effective_to: effectiveTo,
    priority,
    notes,
  };

  let data: { id: string } | null = null;
  let error: { message: string } | null = null;

  if (targetId) {
    const result = await auth.supabaseAdmin
      .from("commission_settings")
      .update(payload)
      .eq("id", targetId)
      .select("id")
      .single();
    data = result.data;
    error = result.error as { message: string } | null;
  } else {
    const result = await auth.supabaseAdmin
      .from("commission_settings")
      .insert({
        ...payload,
        created_by: auth.authUserId,
      })
      .select("id")
      .single();
    data = result.data;
    error = result.error as { message: string } | null;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
