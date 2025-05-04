import { type NextRequest, NextResponse } from "next/server"
import { updateUserStatus } from "@/lib/user-management"

export async function POST(request: NextRequest) {
  try {
    const { userId, userType, status } = await request.json()

    if (!userId || !userType || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await updateUserStatus(
      userId,
      userType as "sender" | "carrier",
      status as "active" | "inactive" | "pending" | "suspended",
    )

    if (!success) {
      return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
