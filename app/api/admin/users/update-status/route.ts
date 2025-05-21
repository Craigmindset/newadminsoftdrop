import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseApi } from "@/lib/supabase-api"

export async function POST(request: NextRequest) {
  try {
    const { userId, userType, status } = await request.json()

    if (!userId || !userType || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseApi()
    const tableName = userType === "sender" ? "sender_profiles" : "carrier_profiles"

    const { error } = await supabase
      .from(tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Failed to update user status", details: String(error) }, { status: 500 })
  }
}
