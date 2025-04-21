import { createClient } from "@supabase/supabase-js"
import { getSupabaseServer } from "./supabase-server"

// Create a Supabase client with admin privileges that can bypass RLS
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing Supabase admin credentials. Falling back to regular client.")
    // Return the regular client as a fallback
    return getSupabaseServer()
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
