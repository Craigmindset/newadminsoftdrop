"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

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

    // Handle profile image upload if provided
    let profile_image_url = existingProfile?.profile_image_url || null

    if (profileImage) {
      try {
        // First, check if the storage bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets()
        const profileBucket = buckets?.find((bucket) => bucket.name === "profile-images")

        if (!profileBucket) {
          // Create the bucket if it doesn't exist
          const { error: bucketError } = await supabase.storage.createBucket("profile-images", {
            public: true,
            fileSizeLimit: 5242880, // 5MB in bytes
          })

          if (bucketError) {
            console.error("Error creating storage bucket:", bucketError)
            return { success: false, error: "Failed to create storage for profile images" }
          }
        }

        // Generate a unique filename
        const fileExt = profileImage.name.split(".").pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = fileName

        // If there was a previous image, delete it from storage
        if (existingProfile?.profile_image_url) {
          const oldFilePath = existingProfile.profile_image_url.split("/").pop()
          if (oldFilePath) {
            await supabase.storage.from("profile-images").remove([oldFilePath])
          }
        }

        // Upload the image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(filePath, profileImage, {
            cacheControl: "3600",
            upsert: true,
          })

        if (uploadError) {
          console.error("Error uploading profile image:", uploadError)
          return { success: false, error: "Failed to upload profile image. Please try again." }
        }

        // Get the public URL for the uploaded image
        const { data: urlData } = supabase.storage.from("profile-images").getPublicUrl(filePath)

        profile_image_url = urlData.publicUrl
      } catch (uploadError) {
        console.error("Error handling profile image:", uploadError)
        return { success: false, error: "Failed to process profile image. Please try again." }
      }
    } else if (removeProfileImage) {
      // If the user wants to remove their profile image
      if (existingProfile?.profile_image_url) {
        const oldFilePath = existingProfile.profile_image_url.split("/").pop()
        if (oldFilePath) {
          await supabase.storage.from("profile-images").remove([oldFilePath])
        }
      }
      profile_image_url = null
    }

    // Prepare the profile data
    const profileData = {
      full_name: fullName,
      email: email,
      address: address,
      profile_image_url,
      updated_at: new Date().toISOString(),
    }

    let result

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
      })
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
