"use server"

import { getSupabaseAdmin } from "@/lib/supabase-admin"
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

    // Try to get admin client, but have a fallback
    let supabase
    let isUsingAdminClient = false
    try {
      supabase = getSupabaseAdmin()

      // Test if we actually have admin access by checking if we can bypass RLS
      const { data: testData, error: testError } = await supabase.rpc("check_service_role")

      if (testError || !testData) {
        console.warn("Service role check failed, falling back to regular client:", testError)
        supabase = getSupabaseServer()
        isUsingAdminClient = false
      } else {
        isUsingAdminClient = true
      }
    } catch (error) {
      console.warn("Failed to get admin client, falling back to regular client:", error)
      supabase = getSupabaseServer()
      isUsingAdminClient = false
    }

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

    // Handle profile image upload if provided
    let profile_image_url = existingProfile?.profile_image_url || null
    let imageUploadError = null

    if (profileImage && isUsingAdminClient) {
      try {
        // If there was a previous image, try to delete it
        if (existingProfile?.profile_image_url) {
          try {
            // Extract the filename from the URL
            const oldUrl = new URL(existingProfile.profile_image_url)
            const oldPath = oldUrl.pathname.split("/").pop()

            if (oldPath) {
              await deleteProfileImage(oldPath)
            }
          } catch (deleteError) {
            console.error("Error deleting old profile image:", deleteError)
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
    } else if (profileImage && !isUsingAdminClient) {
      imageUploadError = "Profile image upload requires admin credentials. Please contact the administrator."
    } else if (removeProfileImage && isUsingAdminClient) {
      // If the user wants to remove their profile image
      if (existingProfile?.profile_image_url) {
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
      profile_image_url = null
    }

    // Prepare the profile data
    const profileData = {
      full_name: fullName,
      email: email,
      address: address,
      updated_at: new Date().toISOString(),
    }

    // Only include profile_image_url if we're using admin client or not changing it
    if (isUsingAdminClient || (!profileImage && !removeProfileImage)) {
      profileData["profile_image_url"] = profile_image_url
    }

    let result

    // If we're not using admin client, try to use RPC function instead
    // This is more likely to work with RLS policies
    if (!isUsingAdminClient) {
      try {
        result = await supabase.rpc("update_sender_profile", {
          p_user_id: userId,
          p_full_name: fullName,
          p_email: email,
          p_address: address,
        })

        if (result.error) {
          console.error("Error updating profile via RPC:", result.error)

          // Fall back to direct update as a last resort
          result = await supabase.from("sender_profiles").update(profileData).eq("user_id", userId)
        }
      } catch (rpcError) {
        console.error("RPC function not available, falling back to direct update:", rpcError)
        result = await supabase.from("sender_profiles").update(profileData).eq("user_id", userId)
      }
    } else {
      // With admin client, we can directly update
      if (existingProfile) {
        // Update existing profile
        result = await supabase.from("sender_profiles").update(profileData).eq("user_id", userId)
      } else {
        // Create new profile
        result = await supabase.from("sender_profiles").insert({
          ...profileData,
          user_id: userId,
          phone_number: phoneNumber,
          created_at: new Date().toISOString(),
          profile_image_url: profile_image_url,
        })
      }
    }

    if (result.error) {
      console.error("Error updating profile:", result.error)

      // Check if this is an RLS error
      if (result.error.message.includes("row-level security") || result.error.message.includes("policy")) {
        // Last resort: try to use a direct SQL query with service role
        try {
          const adminClient = getSupabaseAdmin()

          // Use a direct SQL query to update the profile
          // This bypasses RLS completely
          const { error: sqlError } = await adminClient.rpc("admin_update_sender_profile", {
            p_user_id: userId,
            p_full_name: fullName,
            p_email: email,
            p_address: address,
          })

          if (sqlError) {
            console.error("Error with admin update:", sqlError)
            return {
              success: false,
              error: "Permission denied: Unable to update profile due to security policies.",
              details:
                "This may be resolved by setting up the SUPABASE_SERVICE_ROLE_KEY environment variable correctly.",
            }
          }

          // If we got here, the update was successful
        } catch (sqlError) {
          console.error("Error with admin SQL update:", sqlError)
          return {
            success: false,
            error: "Permission denied: Unable to update profile due to security policies.",
            details: "This may be resolved by setting up the SUPABASE_SERVICE_ROLE_KEY environment variable correctly.",
          }
        }
      } else {
        return { success: false, error: result.error.message }
      }
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

    // Try to get admin client, but have a fallback
    let supabase
    try {
      supabase = getSupabaseAdmin()

      // Test if we actually have admin access
      const { data: testData, error: testError } = await supabase.rpc("check_service_role")

      if (testError || !testData) {
        console.warn("Service role check failed, falling back to regular client:", testError)
        supabase = getSupabaseServer()
      }
    } catch (error) {
      console.warn("Failed to get admin client, falling back to regular client:", error)
      supabase = getSupabaseServer()
    }

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
