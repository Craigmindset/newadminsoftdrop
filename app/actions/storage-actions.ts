"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { cookies } from "next/headers"

export async function uploadProfileImage(imageFile: File) {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return { success: false, error: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    if (!userId) {
      return { success: false, error: "User ID not found" }
    }

    // Get the regular user client
    const supabase = getSupabaseServer()

    // Use the known bucket name
    const bucketName = "profile_images"

    // Generate a unique filename with user-specific path
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload the image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("Error uploading profile image:", uploadError)

      // Check if bucket doesn't exist
      if (uploadError.message.includes("bucket") && uploadError.message.includes("not found")) {
        return {
          success: false,
          error: "Storage bucket not found. Please create a 'profile_images' bucket in your Supabase storage.",
        }
      }

      // Check if this is an RLS error
      if (uploadError.message.includes("row-level security") || uploadError.message.includes("policy")) {
        return {
          success: false,
          error: "Permission denied: Unable to upload file due to security policies.",
          details: uploadError.message,
        }
      }

      return { success: false, error: "Failed to upload profile image. Please try again." }
    }

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName)

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
    }
  } catch (error) {
    console.error("Error handling profile image:", error)
    return {
      success: false,
      error: "Failed to process profile image. Please try again.",
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function deleteProfileImage(filePath: string) {
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return { success: false, error: "Not authenticated" }
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.userId

    if (!userId) {
      return { success: false, error: "User ID not found" }
    }

    // Get the regular user client
    const supabase = getSupabaseServer()

    // Use the known bucket name
    const bucketName = "profile_images"

    // Delete the file
    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      console.error("Error deleting profile image:", error)
      return { success: false, error: "Failed to delete profile image." }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting profile image:", error)
    return { success: false, error: "Failed to delete profile image." }
  }
}
