import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// This is a safe way to get cookies in a Server Component
let supabaseUrl: string
let supabaseKey: string

// Initialize these variables safely
if (typeof process !== "undefined") {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
}

export function getSupabaseServer() {
  try {
    // For server components, use cookies() to get the auth cookie
    const cookieStore = cookies()

    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    })
  } catch (e) {
    // If cookies() fails (e.g., in a Client Component), fall back to a simple client
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    })
  }
}

// Types
export type SenderProfile = {
  id?: string
  user_id: string
  phone_number: string
  created_at?: string
  updated_at?: string
  full_name?: string
  email?: string
  address?: string
}
