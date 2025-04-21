"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type ProfileFormData = {
  fullName?: string
  email?: string
  address?: string
}

// Enhanced error type for better error handling
export type ProfileUpdateResult = {
  success: boolean
  error?: string
  errorCode?: string
  errorDetails?: any
  timestamp?: string
  userId?: string
  context?: string
}

// Create a Supabase client with the service role key to bypass RLS
function getServiceSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    // Log the actual values for debugging (only in non-production)
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Supabase URL:",
        supabaseUrl ? "Set (starts with: " + supabaseUrl.substring(0, 10) + "...)" : "Not set",
      )
      console.log(
        "Supabase Service Key:",
        supabaseServiceKey ? "Set (starts with: " + supabaseServiceKey.substring(0, 5) + "...)" : "Not set",
      )
    }

    // Validate URL format
    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    }

    // Check if URL is valid
    try {
      new URL(supabaseUrl)
    } catch (error) {
      throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
    }

    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    throw new Error(`Supabase client initialization failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Helper function for consistent error logging
function logError(message: string, error: any, userId?: string, context?: string) {
  const timestamp = new Date().toISOString()

  // Make sure we're using the correct environment value
  // Don't use VERCEL_ENV directly as it appears to be misconfigured
  const environment = process.env.NODE_ENV || "development"

  const errorDetails = {
    message,
    timestamp,
    userId: userId || "unknown",
    environment,
    context,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
  }

  console.error(JSON.stringify(errorDetails, null, 2))
  return errorDetails
}

export async function updateSenderProfile(formData: ProfileFormData): Promise<ProfileUpdateResult> {
  const timestamp = new Date().toISOString()
  let userId: string | undefined
  let context = "initializing"

  try {
    // Use NODE_ENV instead of VERCEL_ENV since VERCEL_ENV appears to be misconfigured
    const environment = process.env.NODE_ENV || "development"

    // Log environment information
    console.log(`[${timestamp}] Profile update initiated in environment: ${environment}`)
    console.log(`[${timestamp}] Supabase URL available: ${!!process.env.NEXT_PUBLIC_SUPABASE_URL}`)
    console.log(`[${timestamp}] Supabase service role key available: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}`)

    // Get the session from cookies
    context = "retrieving session"
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      const error = "No session cookie found"
      logError(error, null, undefined, context)
      return {
        success: false,
        error: "Not authenticated. Please log in again.",
        errorCode: "AUTH_NO_SESSION",
        timestamp,
      }
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (error) {
      const errorDetails = logError("Failed to parse session cookie", error, undefined, context)
      return {
        success: false,
        error: "Invalid session format. Please log in again.",
        errorCode: "AUTH_INVALID_SESSION",
        errorDetails,
        timestamp,
      }
    }

    userId = session.userId
    const phoneNumber = session.phoneNumber

    if (!userId) {
      const error = "No user ID found in session"
      logError(error, null, undefined, context)
      return {
        success: false,
        error: "User ID not found in session. Please log in again.",
        errorCode: "AUTH_NO_USER_ID",
        timestamp,
        context,
      }
    }

    console.log(`[${timestamp}] Attempting to update profile for user: ${userId}`)

    // Check if service role key is available
    context = "checking service role key"
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseServiceKey) {
      const error = "Missing SUPABASE_SERVICE_ROLE_KEY environment variable"
      logError(error, null, userId, context)
      return {
        success: false,
        error: "Server configuration error: Missing service role key",
        errorCode: "CONFIG_MISSING_SERVICE_KEY",
        timestamp,
        userId,
        context,
      }
    }

    // Get Supabase client with service role key to bypass RLS
    context = "initializing supabase client"
    let supabase
    try {
      supabase = getServiceSupabase()
    } catch (error) {
      const errorDetails = logError("Failed to initialize Supabase client", error, userId, context)
      return {
        success: false,
        error: "Failed to connect to database. Please try again later.",
        errorCode: "DB_CONNECTION_ERROR",
        errorDetails,
        timestamp,
        userId,
        context,
      }
    }

    // Check if profile exists
    context = "fetching existing profile"
    let existingProfile
    try {
      const { data, error: fetchError } = await supabase
        .from("sender_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        const errorDetails = logError("Error fetching profile", fetchError, userId, context)
        return {
          success: false,
          error: `Error fetching your profile: ${fetchError.message}`,
          errorCode: `DB_FETCH_ERROR_${fetchError.code}`,
          errorDetails,
          timestamp,
          userId,
          context,
        }
      }

      existingProfile = data
      console.log(`[${timestamp}] Existing profile found:`, !!existingProfile)
    } catch (error) {
      const errorDetails = logError("Exception while fetching profile", error, userId, context)
      return {
        success: false,
        error: "Failed to retrieve your profile. Please try again later.",
        errorCode: "DB_FETCH_EXCEPTION",
        errorDetails,
        timestamp,
        userId,
        context,
      }
    }

    // Update or create profile
    context = existingProfile ? "updating profile" : "creating profile"
    try {
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("sender_profiles")
          .update({
            full_name: formData.fullName,
            email: formData.email,
            address: formData.address,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)

        if (error) {
          const errorDetails = logError("Error updating profile", error, userId, context)
          return {
            success: false,
            error: `Failed to update profile: ${error.message}`,
            errorCode: `DB_UPDATE_ERROR_${error.code}`,
            errorDetails,
            timestamp,
            userId,
            context,
          }
        }
      } else {
        // Create new profile
        console.log(`[${timestamp}] Creating new profile with data:`, {
          user_id: userId,
          phone_number: phoneNumber,
          full_name: formData.fullName,
          email: formData.email,
          address: formData.address,
        })

        const { error } = await supabase.from("sender_profiles").insert({
          user_id: userId,
          phone_number: phoneNumber,
          full_name: formData.fullName,
          email: formData.email,
          address: formData.address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          const errorDetails = logError("Error creating profile", error, userId, context)
          return {
            success: false,
            error: `Failed to create profile: ${error.message}`,
            errorCode: `DB_INSERT_ERROR_${error.code}`,
            errorDetails,
            timestamp,
            userId,
            context,
          }
        }
      }
    } catch (error) {
      const errorDetails = logError(
        `Exception while ${existingProfile ? "updating" : "creating"} profile`,
        error,
        userId,
        context,
      )
      return {
        success: false,
        error: `An error occurred while ${existingProfile ? "updating" : "creating"} your profile. Please try again later.`,
        errorCode: existingProfile ? "DB_UPDATE_EXCEPTION" : "DB_INSERT_EXCEPTION",
        errorDetails,
        timestamp,
        userId,
        context,
      }
    }

    // Revalidate the profile page to show updated data
    context = "revalidating path"
    try {
      revalidatePath("/dashboard/profile")
    } catch (error) {
      // Non-fatal error, just log it
      logError("Error revalidating path", error, userId, context)
    }

    console.log(`[${timestamp}] Profile updated successfully for user: ${userId}`)

    return {
      success: true,
      timestamp,
      userId,
      context: "completed",
    }
  } catch (error) {
    const errorDetails = logError("Unhandled exception in updateSenderProfile", error, userId, context)
    return {
      success: false,
      error: "An unexpected error occurred. Our team has been notified.",
      errorCode: "UNHANDLED_EXCEPTION",
      errorDetails,
      timestamp,
      userId,
      context,
    }
  }
}

export async function getSenderProfile() {
  const timestamp = new Date().toISOString()
  let userId: string | undefined
  let context = "initializing"

  try {
    // Get the session from cookies
    context = "retrieving session"
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return null
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (error) {
      logError("Failed to parse session cookie in getSenderProfile", error, undefined, context)
      return null
    }

    userId = session.userId
    if (!userId) {
      return null
    }

    // Get Supabase client with service role key to bypass RLS
    context = "initializing supabase client"
    let supabase
    try {
      supabase = getServiceSupabase()
    } catch (error) {
      logError("Failed to initialize Supabase client in getSenderProfile", error, userId, context)
      return null
    }

    // Get profile data
    context = "fetching profile"
    try {
      const { data, error } = await supabase.from("sender_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        logError("Error fetching profile in getSenderProfile", error, userId, context)
        return null
      }

      return data
    } catch (error) {
      logError("Exception while fetching profile in getSenderProfile", error, userId, context)
      return null
    }
  } catch (error) {
    logError("Unhandled exception in getSenderProfile", error, userId, context)
    return null
  }
}
