import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "all"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const offset = (page - 1) * limit

  const supabase = getSupabaseAdmin()

  try {
    let senderProfiles: any[] = []
    let carrierProfiles: any[] = []
    let senderCount = 0
    let carrierCount = 0

    // Fetch sender profiles if needed
    if (type === "all" || type === "sender") {
      // First get the count for pagination
      const { count: senderTotalCount, error: senderCountError } = await supabase
        .from("sender_profiles")
        .select("*", { count: "exact", head: true })
        .or(search ? `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%` : "id.neq.0")

      if (senderCountError) throw senderCountError
      senderCount = senderTotalCount || 0

      // Then fetch the actual data
      if (senderCount > 0) {
        const { data: senders, error: sendersError } = await supabase
          .from("sender_profiles")
          .select("*, auth_users:user_id(email)")
          .or(
            search ? `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%` : "id.neq.0",
          )
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (sendersError) throw sendersError
        senderProfiles = senders || []
      }
    }

    // Fetch carrier profiles if needed
    if (type === "all" || type === "carrier") {
      // First get the count for pagination
      const { count: carrierTotalCount, error: carrierCountError } = await supabase
        .from("carrier_profiles")
        .select("*", { count: "exact", head: true })
        .or(search ? `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%` : "id.neq.0")

      if (carrierCountError) throw carrierCountError
      carrierCount = carrierTotalCount || 0

      // Then fetch the actual data
      if (carrierCount > 0) {
        const { data: carriers, error: carriersError } = await supabase
          .from("carrier_profiles")
          .select("*, auth_users:user_id(email)")
          .or(
            search ? `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%` : "id.neq.0",
          )
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (carriersError) throw carriersError
        carrierProfiles = carriers || []
      }
    }

    // Get transaction counts for each user
    const userIds = [...senderProfiles, ...carrierProfiles].map((profile) => profile.user_id).filter(Boolean)

    const transactionCounts: Record<string, number> = {}

    if (userIds.length > 0) {
      // Get transaction counts for senders
      const { data: senderTransactions, error: senderTxError } = await supabase
        .from("transactions")
        .select("sender_id, count")
        .in("sender_id", userIds)
        .group("sender_id")

      if (!senderTxError && senderTransactions) {
        senderTransactions.forEach((item) => {
          transactionCounts[item.sender_id] = Number.parseInt(item.count) || 0
        })
      }

      // Get transaction counts for carriers
      const { data: carrierTransactions, error: carrierTxError } = await supabase
        .from("transactions")
        .select("carrier_id, count")
        .in("carrier_id", userIds)
        .group("carrier_id")

      if (!carrierTxError && carrierTransactions) {
        carrierTransactions.forEach((item) => {
          transactionCounts[item.carrier_id] = (transactionCounts[item.carrier_id] || 0) + Number.parseInt(item.count)
        })
      }
    }

    // Format the data
    const formattedSenders = senderProfiles.map((sender) => ({
      id: sender.id,
      name: sender.full_name || "Unknown",
      email: sender.email || sender.auth_users?.email || "",
      phone: sender.phone_number || "",
      type: "sender",
      status: sender.status || "pending",
      joinDate: sender.created_at,
      transactions: transactionCounts[sender.user_id] || 0,
    }))

    const formattedCarriers = carrierProfiles.map((carrier) => ({
      id: carrier.id,
      name: carrier.full_name || "Unknown",
      email: carrier.email || carrier.auth_users?.email || "",
      phone: carrier.phone_number || "",
      type: "carrier",
      status: carrier.status || "pending",
      joinDate: carrier.created_at,
      transactions: transactionCounts[carrier.user_id] || 0,
    }))

    // Combine and sort the results
    let allUsers = [...formattedSenders, ...formattedCarriers]

    // Sort by join date (newest first)
    allUsers.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())

    // If we're fetching all users and have more than the limit, trim the array
    if (type === "all" && allUsers.length > limit) {
      allUsers = allUsers.slice(0, limit)
    }

    return NextResponse.json({
      users: allUsers,
      totalCount: senderCount + carrierCount,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users", details: String(error) }, { status: 500 })
  }
}
