import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with admin privileges that can bypass RLS
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error("Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.")
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing Supabase admin credentials. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.",
    )
  }

  // Check if the service key looks valid (starts with "ey" like a JWT)
  if (!supabaseServiceKey.startsWith("ey")) {
    console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY doesn't look like a valid JWT token")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
