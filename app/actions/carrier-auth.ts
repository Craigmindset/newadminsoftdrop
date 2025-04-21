"use server"

import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

/**
 * Authenticate a carrier with phone number and PIN
 */
export async function authenticateCarrier(phoneNumber: string, pin: string) {
  try {
    const supabase = getSupabaseServer()

    // Format phone number to ensure it has the correct format
    // If it doesn't start with +, add it
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber.replace(/^0/, "234")}`

    console.log(`Attempting to authenticate carrier with phone: ${formattedPhone}`)

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

    // Set session cookie
    cookies().set(
      "carrier-session",
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
      },
    )

    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export async function checkCarrierSession() {
  const sessionCookie = cookies().get("carrier-session")

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

export async function logoutCarrier() {
  try {
    const supabase = getSupabaseServer()
    await supabase.auth.signOut()
    cookies().delete("carrier-session")
  } catch (error) {
    console.error("Logout error:", error)
  }

  redirect("/login/carrier")
}

export async function signUpCarrier(phoneNumber: string, pin: string) {
  try {
    const supabase = getSupabaseServer()

    // Create a unique email-like identifier from the phone number
    const phoneIdentifier = `${phoneNumber.replace(/\+/g, "")}@softdropcarrier.phone`

    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: phoneIdentifier,
      password: pin,
      phone: phoneNumber,
    })

    if (error) {
      console.error("Auth error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, userId: data.user?.id }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function verifyCarrierOtp(phoneNumber: string, otp: string) {
  try {
    const supabase = getSupabaseServer()

    // Verify the OTP with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: "sms",
    })

    if (error) {
      console.error("OTP verification error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, session: data.session }
  } catch (error) {
    console.error("OTP verification error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function sendCarrierOtp(phoneNumber: string) {
  try {
    const supabase = getSupabaseServer()

    // Send OTP via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    })

    if (error) {
      console.error("Send OTP error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Send OTP error in try/catch:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
