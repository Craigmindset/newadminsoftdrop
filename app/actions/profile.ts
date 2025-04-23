"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase-server"
import type { ProfileFormData } from "@/app/actions/update-profile"

export async function updateProfile(formData: ProfileFormData, imageFile: File | null) {
  try {
    const supabase = getSupabaseServer()
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      throw new Error("No session cookie found")
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (error) {
      throw new Error("Invalid session format")
    }

    const userId = session.userId

    if (!userId) {
      throw new Error("User ID not found in session")
    }

    let profile_image_url = null

    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("profile_images")
        .upload(`${userId}/${imageFile.name}`, imageFile, {
          contentType: imageFile.type,
          upsert: true,
        })

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }

      profile_image_url = data.path
    }

    const { error } = await supabase
      .from("sender_profiles")
      .update({
        full_name: formData.fullName,
        email: formData.email,
        address: formData.address,
        profile_image_url: profile_image_url,
      })
      .eq("user_id", userId)

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}
