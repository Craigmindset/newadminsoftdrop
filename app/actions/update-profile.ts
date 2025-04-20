"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export type ProfileFormData = {
  fullName?: string
  email?: string
  address?: string
}

export async function updateSenderProfile(formData: ProfileFormData) {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return { success: false, error: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId
    const phoneNumber = session.phoneNumber

    if (!userId) {
      return { success: false, error: "User ID not found" }
    }

    console.log("Updating profile for user:", userId)
    console.log("Form data:", formData)

    // Get Supabase client
    const supabase = getSupabaseServer()

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("sender_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error fetching profile:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Prepare the profile data
    const profileData = {
      full_name: formData.fullName,
      email: formData.email,
      address: formData.address,
      updated_at: new Date().toISOString(),
    }

    console.log("Profile data to save:", profileData)
    console.log("Profile exists:", !!existingProfile)

    let result

    if (existingProfile) {
      // Update existing profile
      result = await supabase.from("sender_profiles").update(profileData).eq("user_id", userId)

      console.log("Update result:", result)
    } else {
      // Create new profile
      result = await supabase.from("sender_profiles").insert({
        ...profileData,
        user_id: userId,
        phone_number: phoneNumber,
        created_at: new Date().toISOString(),
      })

      console.log("Insert result:", result)
    }

    if (result.error) {
      console.error("Error updating profile:", result.error)
      return { success: false, error: result.error.message }
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/dashboard/profile")

    return { success: true }
  } catch (error) {
    console.error("Profile update error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
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

    // Get Supabase client
    const supabase = getSupabaseServer()

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
