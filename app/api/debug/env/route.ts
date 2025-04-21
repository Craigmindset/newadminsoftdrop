import { NextResponse } from "next/server"

export async function GET() {
  // Create a safe version of the environment variables for display
  const safeEnv = {
    NODE_ENV: process.env.NODE_ENV || "not set",
    VERCEL_ENV: process.env.VERCEL_ENV || "not set",

    // Only show if variables exist and their first few characters
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 12)}...`
      : "not set",

    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`
      : "not set",

    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5)}...`
      : "not set",

    // Check for any environment variables that might be incorrectly set
    ISSUES: [],
  }

  // Check for common issues
  if (process.env.VERCEL_ENV === process.env.NEXT_PUBLIC_SUPABASE_URL) {
    ;(safeEnv.ISSUES as string[]).push("VERCEL_ENV is incorrectly set to the Supabase URL")
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("NEXT_PUBLIC_SUPABASE_URL=")) {
    ;(safeEnv.ISSUES as string[]).push("NEXT_PUBLIC_SUPABASE_URL contains the variable name")
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.includes("SUPABASE_SERVICE_ROLE_KEY=")) {
    ;(safeEnv.ISSUES as string[]).push("SUPABASE_SERVICE_ROLE_KEY contains the variable name")
  }

  // URL validation
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
    }
  } catch (error) {
    ;(safeEnv.ISSUES as string[]).push(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid URL: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  return NextResponse.json(safeEnv)
}
