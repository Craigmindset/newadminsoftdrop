"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type ProfileFormData = {
  fullName?: string
  email?: string
  address?: string
}

// Create a Supabase client with the service role key to bypass RLS
function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or service role key")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function updateSenderProfile(formData: ProfileFormData) {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      console.error("No session cookie found")
      return { success: false, error: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId
    const phoneNumber = session.phoneNumber

    if (!userId) {
      console.error("No user ID found in session")
      return { success: false, error: "User ID not found" }
    }

    console.log("Attempting to update profile for user:", userId)

    // Check if service role key is available
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
      return { success: false, error: "Server configuration error: Missing service role key" }
    }

    // Get Supabase client with service role key to bypass RLS
    const supabase = getServiceSupabase()

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("sender_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error fetching profile:", fetchError)
      return { success: false, error: `Error fetching profile: ${fetchError.message}` }
    }

    console.log("Existing profile found:", !!existingProfile)

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
        console.error("Error updating profile:", error)
        return { success: false, error: `Error updating profile: ${error.message}` }
      }
    } else {
      // Create new profile
      console.log("Creating new profile with data:", {
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
        console.error("Error creating profile:", error)
        return { success: false, error: `Error creating profile: ${error.message}` }
      }
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/dashboard/profile")
    console.log("Profile updated successfully")

    return { success: true }
  } catch (error) {
    console.error("Profile update error:", error)
    return {
      success: false,
      error: error instanceof Error ? `Unexpected error: ${error.message}` : "An unexpected error occurred",
    }
  }
}

export async function getSenderProfile() {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    if (!userId) {
      return null
    }

    // Get Supabase client with service role key to bypass RLS
    const supabase = getServiceSupabase()

    // Get profile data
    const { data, error } = await supabase.from("sender_profiles").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Get profile error:", error)
    return null
  }
}
