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

    // Get Supabase client
    const supabase = getSupabaseServer()

    // Check if profile exists
    const { data: existingProfile } = await supabase.from("sender_profiles").select("*").eq("user_id", userId).single()

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
        return { success: false, error: error.message }
      }
    } else {
      // Create new profile
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
        return { success: false, error: error.message }
      }
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

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Get profile error:", error)
    return null
  }
}
