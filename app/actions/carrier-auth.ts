"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export async function signUpCarrier(phoneNumber: string, password: string) {
  try {
    // Simulate successful signup without using Supabase
    // In a real app, you would store this data in your preferred database

    // Simulate a delay for a more realistic experience
    await new Promise((resolve) => setTimeout(resolve, 800))

    revalidatePath("/signup/carrier")
    return {
      success: true,
      userId: `carrier_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }
  } catch (error) {
    console.error("Carrier signup error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function verifyCarrierOtp(phoneNumber: string, otp: string) {
  try {
    // Simulate OTP verification without using Supabase
    // In a real app, you would verify with your SMS provider

    // For demo purposes, any 6-digit code is accepted
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      return { success: true }
    }

    return { success: false, error: "Invalid OTP" }
  } catch (error) {
    console.error("Carrier OTP verification error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function sendCarrierOtp(phoneNumber: string) {
  try {
    // Simulate sending OTP without using Supabase
    // In a real app, you would send via your SMS provider

    // Simulate a delay for a more realistic experience
    await new Promise((resolve) => setTimeout(resolve, 800))

    return { success: true }
  } catch (error) {
    console.error("Send carrier OTP error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function authenticateCarrier(phoneNumber: string, pin: string) {
  try {
    const supabase = getSupabaseServer()

    // Format phone number to ensure it has the correct format
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber.replace(/^0/, "234")}`

    console.log(`Attempting to authenticate carrier with phone: ${formattedPhone}`)

    // Sign in with phone and password (PIN)
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password: pin,
    })

    if (error) {
      console.error("Carrier login error:", error)
      return { success: false, error: error.message }
    }

    if (!data.user || !data.session) {
      return { success: false, error: "Authentication failed" }
    }

    // Check if user is a carrier in the carrier_profiles table
    const { data: carrierProfile, error: profileError } = await supabase
      .from("carrier_profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single()

    if (profileError || !carrierProfile) {
      console.error("Not a carrier profile:", profileError)
      return { success: false, error: "Account not found or not a carrier" }
    }

    // Set session cookie with updated settings for production compatibility
    cookies().set(
      "sb-session",
      JSON.stringify({
        userId: data.user.id,
        sessionId: data.session.access_token,
        role: "carrier",
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
      redirectUrl: "/carrier/dashboard",
    }
  } catch (error) {
    console.error("Carrier authentication error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function checkCarrierSession() {
  const sessionCookie = cookies().get("sb-session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return session && session.role === "carrier" ? session : null
  } catch (error) {
    console.error("Session parsing error:", error)
    return null
  }
}

export async function logoutCarrier() {
  try {
    const supabase = getSupabaseServer()
    await supabase.auth.signOut()
    cookies().delete("sb-session")
  } catch (error) {
    console.error("Logout error:", error)
  }

  redirect("/login/carrier")
}
