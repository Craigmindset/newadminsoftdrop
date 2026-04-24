import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Client auth state is enforced in app/admin/dashboard/layout.tsx.
  // This middleware intentionally avoids cookie-based redirects because
  // browser-side Supabase auth may not expose a reliable server cookie.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
