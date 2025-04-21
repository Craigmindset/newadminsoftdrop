import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Log environment variables availability (not their values)
    console.log("Environment:", process.env.VERCEL_ENV || "local")
    console.log("Supabase URL available:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Supabase service role key available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase URL or service role key",
          urlAvailable: !!supabaseUrl,
          keyAvailable: !!supabaseServiceKey,
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Test a simple query
    const { data, error } = await supabase.from("sender_profiles").select("count(*)").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      data,
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
