"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServer } from "@/lib/supabase-server"
import { cookies } from "next/headers"

/**
 * Authenticate a carrier with phone number and PIN
 */
export async function authenticateCarrier(phoneNumber: string, pin: string) {
  try {
    const supabase = getSupabaseServer()

    // Format phone number to ensure it has the correct format
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber.replace(/^0/, "234")}`

    console.log(`Attempting to authenticate carrier with phone: ${formattedPhone}`)

    // Sign in with phone and password (PIN)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${phoneNumber.replace(/\+/g, "")}@softdrop.carrier`, // Use email parameter instead of phone
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

export async function signUpCarrier(phoneNumber: string, password: string) {
  try {
    const supabase = getSupabaseServer()

    // Create a unique email-like identifier from the phone number
    const phoneIdentifier = `${phoneNumber.replace(/\+/g, "")}@softdrop.carrier`

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: phoneIdentifier,
      password: password,
      phone: phoneNumber,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create user" }
    }

    // Create a profile in the carrier_profiles table
    const { error: profileError } = await supabase.from("carrier_profiles").insert({
      user_id: authData.user.id,
      phone_number: phoneNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    revalidatePath("/login/carrier")
    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.error("Carrier signup error:", error)
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
    console.error("Carrier OTP verification error:", error)
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
    console.error("Send carrier OTP error in try/catch:", error)
    throw error // Re-throw to be handled by safeSupabaseOperation
  }
}
