"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { uploadProfileImage, deleteProfileImage } from "./storage-actions"

export type ProfileFormData = {
  fullName?: string
  email?: string
  address?: string
}

export async function updateSenderProfile(formData: FormData) {
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

    // Extract form data
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const profileImage = formData.get("profileImage") as File | null
    const removeProfileImage = formData.get("removeProfileImage") === "true"

    // Get the regular user client
    const supabase = getSupabaseServer()

    // Fetch existing profile to check for existing image
    const { data: existingProfile, error: existingProfileError } = await supabase
      .from("sender_profiles")
      .select("profile_image_url")
      .eq("user_id", userId)
      .single()

    if (existingProfileError && existingProfileError.code !== "PGRST116") {
      console.error("Error fetching existing profile:", existingProfileError)
      return { success: false, error: "Failed to fetch existing profile." }
    }

    // Handle profile image upload if provided
    let profile_image_url = null
    let imageUploadError = null

    if (profileImage) {
      try {
        // If there was a previous image, try to delete it
        if (removeProfileImage && existingProfile?.profile_image_url) {
          try {
            // Extract the filename from the URL
            const oldUrl = new URL(existingProfile.profile_image_url)
            const oldPath = oldUrl.pathname.split("/").pop()

            if (oldPath) {
              await deleteProfileImage(oldPath)
            }
          } catch (deleteError) {
            console.error("Error deleting profile image:", deleteError)
            // Continue even if delete fails
          }
        }

        // Upload the new image using our dedicated function
        const uploadResult = await uploadProfileImage(profileImage)

        if (!uploadResult.success) {
          imageUploadError = uploadResult.error
          console.error("Image upload failed but continuing with profile update:", uploadResult.error)
          // Continue with profile update even if image upload fails
        } else {
          profile_image_url = uploadResult.url
        }
      } catch (uploadError) {
        console.error("Error handling profile image:", uploadError)
        imageUploadError = "Failed to process profile image. Please try again."
        // Continue with profile update even if image upload fails
      }
    } else if (removeProfileImage) {
      // If the user wants to remove their profile image
      profile_image_url = null
    }

    // Prepare the profile data
    const profileData = {
      full_name: fullName,
      email: email,
      address: address,
      updated_at: new Date().toISOString(),
      profile_image_url: profile_image_url,
    }

    let result

    try {
      result = await supabase.from("sender_profiles").upsert(
        {
          user_id: userId,
          phone_number: phoneNumber,
          full_name: fullName,
          email: email,
          address: address,
          updated_at: new Date().toISOString(),
          profile_image_url: profile_image_url,
        },
        { onConflict: "user_id" },
      )

      if (result.error) {
        console.error("Error updating profile:", result.error)
        return { success: false, error: result.error.message }
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return { success: false, error: "Failed to update profile. Please try again." }
    }

    // Revalidate the profile page to show updated data
    revalidatePath("/dashboard/profile")

    // Return success but include image error if there was one
    if (imageUploadError) {
      return {
        success: true,
        warning: "Profile updated but image upload failed",
        error: imageUploadError,
      }
    }

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

    // Use regular client first
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
