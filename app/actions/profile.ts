"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase-server"
import { v4 as uuidv4 } from "uuid"

export async function updateProfile(prevState: any, formData: FormData) {
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

    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const file = formData.get("file") as File | null

    let profile_image_url: string | null = null

    if (file) {
      const { data, error } = await supabase.storage
        .from("profile_images")
        .upload(`${userId}/${uuidv4()}.${file.name.split(".").pop()}`, file, {
          contentType: file.type,
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
        full_name: fullName,
        email: email,
        address: address,
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
    return { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}
