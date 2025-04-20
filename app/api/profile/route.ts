import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function GET() {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 })
    }

    // Get Supabase client
    const supabase = getSupabaseServer()

    // Get profile data
    const { data, error } = await supabase.from("sender_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
