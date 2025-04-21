import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key to bypass RLS
function getServiceSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    // Validate URL format
    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    }

    // Check if URL is valid
    try {
      new URL(supabaseUrl)
    } catch (error) {
      throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
    }

    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    throw new Error(`Supabase client initialization failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function GET() {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ error: "Invalid session format" }, { status: 401 })
    }

    const userId = session.userId
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 401 })
    }

    // Get Supabase client
    const supabase = getServiceSupabase()

    // Get profile data
    const { data, error } = await supabase.from("sender_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unhandled exception in profile API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
