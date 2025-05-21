"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServer } from "@/lib/supabase-server"

export async function signUpCarrier(
  phoneNumber: string,
  password: string,
  fullName: string,
  email: string,
  address: string,
) {
  try {
    const supabase = getSupabaseServer()

    // Create a unique email-like identifier from the phone number
    const phoneIdentifier = `${phoneNumber.replace(/\+/g, "")}@softdrop.carrier`

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: phoneIdentifier,
      password: password,
      phone: phoneNumber,
      options: {
        data: {
          full_name: fullName,
          email: email,
        },
      },
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
      full_name: fullName,
      email: email,
      address: address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Profile error:", profileError)
      return { success: false, error: profileError.message }
    }

    revalidatePath("/signup/carrier")
    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.error("Carrier signup error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function verifyCarrierOtp(phoneNumber: string, otp: string) {
  try {
    // Bypass OTP verification for testing
    if (otp === "111111") {
      return { success: true, session: { access_token: "hardcoded_session_token" } }
    } else {
      return { success: false, error: "Invalid verification code" }
    }
  } catch (error) {
    console.error("Carrier OTP verification error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function sendCarrierOtp(phoneNumber: string) {
  try {
    // For testing, always return success without sending an actual OTP
    return { success: true }
  } catch (error) {
    console.error("Send carrier OTP error in try/catch:", error)
    throw error // Re-throw to be handled by safeSupabaseOperation
  }
}
