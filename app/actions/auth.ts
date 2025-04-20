"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServer, type SenderProfile } from "@/lib/supabase-server"

// Helper function to safely execute Supabase operations
async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
): Promise<{ success: boolean; data?: T; error?: string; solution?: string; details?: string }> {
  try {
    const result = await operation()
    return { success: true, data: result }
  } catch (error) {
    console.error("Supabase operation error:", error)

    // Handle specific error types
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    // Provide specific solutions based on error message
    let solution = "Please check your Supabase configuration and try again."
    let details = undefined

    if (errorMessage.includes("Supabase URL is missing")) {
      solution = "Add NEXT_PUBLIC_SUPABASE_URL to your environment variables."
    } else if (errorMessage.includes("Invalid Supabase URL format")) {
      // Check if the URL contains the variable name
      if (errorMessage.includes("NEXT_PUBLIC_SUPABASE_URL=")) {
        solution =
          "Your environment variable appears to be incorrectly formatted. Make sure you're setting just the URL value without the variable name."
        details =
          "Example: NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co (in .env file), but the value should be just https://your-project.supabase.co"
      } else {
        solution =
          "Ensure your NEXT_PUBLIC_SUPABASE_URL starts with https:// and is properly formatted (e.g., https://your-project.supabase.co)."
      }
    } else if (errorMessage.includes("Supabase API Key is missing")) {
      solution = "Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables."
    } else if (errorMessage.includes("Invalid Supabase API Key format")) {
      solution =
        "Ensure your NEXT_PUBLIC_SUPABASE_ANON_KEY is correctly formatted. It should start with 'ey' and be at least 30 characters long."
      details = "Go to your Supabase dashboard > Project Settings > API to get the correct anon key."
    } else if (errorMessage.includes("Invalid API key")) {
      solution =
        "Your Supabase API key is invalid. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
      details = "Go to your Supabase dashboard > Project Settings > API to get the correct anon key."
    }

    return {
      success: false,
      error: errorMessage,
      solution,
      details,
    }
  }
}

export async function signUpSender(phoneNumber: string, pin: string) {
  return await safeSupabaseOperation(async () => {
    const supabase = getSupabaseServer()

    // Create a unique email-like identifier from the phone number
    const phoneIdentifier = `${phoneNumber.replace(/\+/g, "")}@softdrop.phone`

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: phoneIdentifier,
      password: pin,
      phone: phoneNumber,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create user" }
    }

    // Create a profile in the sender_profiles table
    const { error: profileError } = await supabase.from("sender_profiles").insert({
      user_id: authData.user.id,
      phone_number: phoneNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as SenderProfile)

    if (profileError) {
      console.error("Profile error:", profileError)
      return { success: false, error: profileError.message }
    }

    revalidatePath("/login")
    return { success: true, userId: authData.user.id }
  })
}

export async function verifyOtp(phoneNumber: string, otp: string) {
  return await safeSupabaseOperation(async () => {
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
  })
}

export async function sendOtp(phoneNumber: string) {
  return await safeSupabaseOperation(async () => {
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
      throw error // Re-throw to be handled by safeSupabaseOperation
    }
  })
}
