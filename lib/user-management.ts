import { getSupabaseServer } from "./supabase-server"

export type UserProfile = {
  id: string
  name: string
  email: string
  phone: string
  type: "sender" | "carrier"
  status: "active" | "inactive" | "pending"
  joinDate: string
  transactions: number
}

export async function fetchUsers(
  userType: "all" | "sender" | "carrier" = "all",
  page = 1,
  limit = 10,
  searchQuery = "",
): Promise<{
  users: UserProfile[]
  totalCount: number
}> {
  const supabase = getSupabaseServer()
  const offset = (page - 1) * limit

  try {
    let senderProfiles: any[] = []
    let carrierProfiles: any[] = []
    let senderCount = 0
    let carrierCount = 0

    // Fetch sender profiles if needed
    if (userType === "all" || userType === "sender") {
      // First get the count for pagination
      const { count: senderTotalCount, error: senderCountError } = await supabase
        .from("sender_profiles")
        .select("*", { count: "exact", head: true })
        .or(
          searchQuery
            ? `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
            : "id.neq.0",
        )

      if (senderCountError) throw senderCountError
      senderCount = senderTotalCount || 0

      // Then fetch the actual data
      if (senderCount > 0) {
        const { data: senders, error: sendersError } = await supabase
          .from("sender_profiles")
          .select("*, auth_users:user_id(email)")
          .or(
            searchQuery
              ? `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
              : "id.neq.0",
          )
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (sendersError) throw sendersError
        senderProfiles = senders || []
      }
    }

    // Fetch carrier profiles if needed
    if (userType === "all" || userType === "carrier") {
      // First get the count for pagination
      const { count: carrierTotalCount, error: carrierCountError } = await supabase
        .from("carrier_profiles")
        .select("*", { count: "exact", head: true })
        .or(
          searchQuery
            ? `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
            : "id.neq.0",
        )

      if (carrierCountError) throw carrierCountError
      carrierCount = carrierTotalCount || 0

      // Then fetch the actual data
      if (carrierCount > 0) {
        const { data: carriers, error: carriersError } = await supabase
          .from("carrier_profiles")
          .select("*, auth_users:user_id(email)")
          .or(
            searchQuery
              ? `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
              : "id.neq.0",
          )
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (carriersError) throw carriersError
        carrierProfiles = carriers || []
      }
    }

    // Get transaction counts for each user
    const userIds = [...senderProfiles, ...carrierProfiles].map((profile) => profile.user_id)

    const transactionCounts: Record<string, number> = {}

    if (userIds.length > 0) {
      // Get transaction counts for senders
      const { data: senderTransactions, error: senderTxError } = await supabase
        .from("transactions")
        .select("sender_id, count")
        .in("sender_id", userIds)
        .group("sender_id")

      if (senderTxError) throw senderTxError

      if (senderTransactions) {
        senderTransactions.forEach((item) => {
          transactionCounts[item.sender_id] = Number.parseInt(item.count)
        })
      }

      // Get transaction counts for carriers
      const { data: carrierTransactions, error: carrierTxError } = await supabase
        .from("transactions")
        .select("carrier_id, count")
        .in("carrier_id", userIds)
        .group("carrier_id")

      if (carrierTxError) throw carrierTxError

      if (carrierTransactions) {
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
      type: "sender" as const,
      status: sender.status || "pending",
      joinDate: sender.created_at,
      transactions: transactionCounts[sender.user_id] || 0,
    }))

    const formattedCarriers = carrierProfiles.map((carrier) => ({
      id: carrier.id,
      name: carrier.full_name || "Unknown",
      email: carrier.email || carrier.auth_users?.email || "",
      phone: carrier.phone_number || "",
      type: "carrier" as const,
      status: carrier.status || "pending",
      joinDate: carrier.created_at,
      transactions: transactionCounts[carrier.user_id] || 0,
    }))

    // Combine and sort the results
    let allUsers = [...formattedSenders, ...formattedCarriers]

    // Sort by join date (newest first)
    allUsers.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())

    // If we're fetching all users and have more than the limit, trim the array
    if (userType === "all" && allUsers.length > limit) {
      allUsers = allUsers.slice(0, limit)
    }

    return {
      users: allUsers,
      totalCount: senderCount + carrierCount,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      users: [],
      totalCount: 0,
    }
  }
}

export async function getUserDetails(userId: string, userType: "sender" | "carrier"): Promise<any> {
  const supabase = getSupabaseServer()

  try {
    const tableName = userType === "sender" ? "sender_profiles" : "carrier_profiles"

    const { data, error } = await supabase.from(tableName).select("*, auth_users:user_id(*)").eq("id", userId).single()

    if (error) throw error

    return data
  } catch (error) {
    console.error(`Error fetching ${userType} details:`, error)
    return null
  }
}

export async function updateUserStatus(
  userId: string,
  userType: "sender" | "carrier",
  status: "active" | "inactive" | "pending" | "suspended",
): Promise<boolean> {
  const supabase = getSupabaseServer()

  try {
    const tableName = userType === "sender" ? "sender_profiles" : "carrier_profiles"

    const { error } = await supabase
      .from(tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) throw error

    return true
  } catch (error) {
    console.error(`Error updating ${userType} status:`, error)
    return false
  }
}
