import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseApi } from "@/lib/supabase-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const searchParams = request.nextUrl.searchParams
  const userType = searchParams.get("type") === "carrier" ? "carrier" : "sender"

  try {
    const supabase = getSupabaseApi()
    const tableName = userType === "carrier" ? "carrier_profiles" : "sender_profiles"

    const { data: user, error } = await supabase
      .from(tableName)
      .select("*, auth_users:user_id(*)")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching user details:", error)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error in user details API route:", error)
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 })
  }
}
