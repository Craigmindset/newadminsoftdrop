import { NextResponse } from "next/server";

type AuthDebugPayload = {
  flow?: string;
  stage?: string;
  email?: string;
  redirectTo?: string;
  message?: string;
  code?: string;
  status?: number | null;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as AuthDebugPayload;

  const { flow = "unknown", stage = "unknown", ...rest } = payload;

  console.log("[admin auth debug]", {
    flow,
    stage,
    ...rest,
  });

  return NextResponse.json({ ok: true });
}
