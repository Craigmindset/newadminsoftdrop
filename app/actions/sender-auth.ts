"use server"

import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export async function authenticateSender(phoneNumber: string, pin: string) {
  try {
    const supabase = getSupabaseServer()

    // Format phone number to ensure it has the correct format
    // If it doesn't start with +, add it
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber.replace(/^0/, "234")}`

    console.log(`Attempting to authenticate with phone: ${formattedPhone}`)

    // Sign in with phone and password (PIN)
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone, // Use phone parameter instead of email
      password: pin,
    })

    if (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }

    if (!data.user || !data.session) {
      return { success: false, error: "Authentication failed" }
    }

    // Set session cookie with updated settings for production compatibility
    cookies().set(
      "sb-session",
      JSON.stringify({
        userId: data.user.id,
        sessionId: data.session.access_token,
        role: "sender",
        phoneNumber: formattedPhone,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
        // Removed domain specification to use current domain automatically
        sameSite: "lax", // Added for better security and cookie handling
      },
    )

    return {
      success: true,
      userId: data.user.id,
      // Add redirect URL for hard navigation
      redirectUrl: "/dashboard",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function checkSenderSession() {
  const sessionCookie = cookies().get("sb-session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return session
  } catch (error) {
    console.error("Session parsing error:", error)
    return null
  }
}

export async function logoutSender() {
  try {
    const supabase = getSupabaseServer()
    await supabase.auth.signOut()
    cookies().delete("sb-session")
  } catch (error) {
    console.error("Logout error:", error)
  }

  redirect("/login")
}
