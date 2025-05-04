import { getSupabaseServer } from "./supabase-server"

export type AdminDashboardStats = {
  totalUsers: number
  activeCarriers: number
  activeSenders: number
  pendingDisputes: number
  totalTransactions: number
  revenue: number
  weeklyGrowth: number
}

export type DisputeStats = {
  total: number
  pending: number
  inReview: number
  resolved: number
  byType: {
    [key: string]: number
  }
  resolutionRate: number
}

export type TimeframeOption = "daily" | "weekly" | "monthly"

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = getSupabaseServer()

  try {
    // Get user counts
    const { count: totalUsersCount, error: usersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (usersError) throw usersError

    // Get active carriers count
    const { count: activeCarriersCount, error: carriersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "carrier")
      .eq("status", "active")

    if (carriersError) throw carriersError

    // Get active senders count
    const { count: activeSendersCount, error: sendersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "sender")
      .eq("status", "active")

    if (sendersError) throw sendersError

    // Get pending disputes count
    const { count: pendingDisputesCount, error: disputesError } = await supabase
      .from("disputes")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (disputesError) throw disputesError

    // Get transaction data
    const { data: transactions, error: transactionsError } = await supabase.from("transactions").select("amount")

    if (transactionsError) throw transactionsError

    // Calculate total revenue (assuming 5% commission)
    const totalTransactions = transactions ? transactions.length : 0
    const totalAmount = transactions ? transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) : 0
    const revenue = totalAmount * 0.05 // 5% commission

    // Calculate weekly growth (this would need more sophisticated logic in a real app)
    // For now, we'll return a placeholder value
    const weeklyGrowth = 8.5 // Placeholder

    return {
      totalUsers: totalUsersCount || 0,
      activeCarriers: activeCarriersCount || 0,
      activeSenders: activeSendersCount || 0,
      pendingDisputes: pendingDisputesCount || 0,
      totalTransactions,
      revenue,
      weeklyGrowth,
    }
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error)
    // Return default values if there's an error
    return {
      totalUsers: 0,
      activeCarriers: 0,
      activeSenders: 0,
      pendingDisputes: 0,
      totalTransactions: 0,
      revenue: 0,
      weeklyGrowth: 0,
    }
  }
}

export async function getDisputeStatistics(timeframe: TimeframeOption): Promise<DisputeStats> {
  const supabase = getSupabaseServer()

  try {
    // Get date range based on timeframe
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case "daily":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 1)
        break
      case "weekly":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "monthly":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      default:
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7) // Default to weekly
    }

    const startDateStr = startDate.toISOString()

    // Get all disputes in the timeframe
    const { data: disputes, error: disputesError } = await supabase
      .from("disputes")
      .select("*")
      .gte("created_at", startDateStr)

    if (disputesError) throw disputesError

    if (!disputes || disputes.length === 0) {
      return {
        total: 0,
        pending: 0,
        inReview: 0,
        resolved: 0,
        byType: {},
        resolutionRate: 0,
      }
    }

    // Count disputes by status
    const pending = disputes.filter((d) => d.status === "pending").length
    const inReview = disputes.filter((d) => d.status === "in-review").length
    const resolved = disputes.filter((d) => d.status === "resolved").length

    // Count disputes by type
    const byType: { [key: string]: number } = {}
    disputes.forEach((dispute) => {
      const type = dispute.type || "unknown"
      byType[type] = (byType[type] || 0) + 1
    })

    // Calculate resolution rate
    const resolutionRate = disputes.length > 0 ? Math.round((resolved / disputes.length) * 100) : 0

    return {
      total: disputes.length,
      pending,
      inReview,
      resolved,
      byType,
      resolutionRate,
    }
  } catch (error) {
    console.error("Error fetching dispute statistics:", error)
    return {
      total: 0,
      pending: 0,
      inReview: 0,
      resolved: 0,
      byType: {},
      resolutionRate: 0,
    }
  }
}

export async function getRecentActivity(limit = 5) {
  const supabase = getSupabaseServer()

  try {
    // Get recent user registrations
    const { data: recentUsers, error: usersError } = await supabase
      .from("profiles")
      .select("id, created_at, role, full_name")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (usersError) throw usersError

    // Get recent transactions
    const { data: recentTransactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("id, created_at, amount, type")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (transactionsError) throw transactionsError

    // Get recent disputes
    const { data: recentDisputes, error: disputesError } = await supabase
      .from("disputes")
      .select("id, created_at, status, resolution")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (disputesError) throw disputesError

    // Combine and sort all activities
    const allActivities = [
      ...(recentUsers || []).map((user) => ({
        type: "user_registration",
        id: user.id,
        timestamp: user.created_at,
        data: user,
      })),
      ...(recentTransactions || []).map((tx) => ({
        type: "transaction",
        id: tx.id,
        timestamp: tx.created_at,
        data: tx,
      })),
      ...(recentDisputes || []).map((dispute) => ({
        type: "dispute",
        id: dispute.id,
        timestamp: dispute.created_at,
        data: dispute,
      })),
    ]
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      .slice(0, limit)

    return allActivities
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return []
  }
}
