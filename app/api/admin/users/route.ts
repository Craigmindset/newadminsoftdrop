import { type NextRequest, NextResponse } from "next/server"
import { fetchUsers } from "@/lib/user-management"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = (searchParams.get("type") as "all" | "sender" | "carrier") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  try {
    const { users, totalCount } = await fetchUsers(type, page, limit, search)

    return NextResponse.json({
      users,
      totalCount,
    })
  } catch (error) {
    console.error("Error in users API route:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
