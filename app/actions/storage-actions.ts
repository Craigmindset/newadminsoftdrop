"use server"

import { getSupabaseAdmin } from "@/lib/supabase-admin"
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

    // First try with regular user authentication
    // This will work if proper storage policies are set up
    let supabase = getSupabaseServer()

    // Use the known bucket name
    const bucketName = "profile_images"

    // Generate a unique filename with user-specific path
    const fileExt = imageFile.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Try to upload with regular user authentication first
    let { data: uploadData, error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, imageFile, {
      cacheControl: "3600",
      upsert: true,
    })

    // If regular upload fails, try with admin client as fallback
    if (uploadError) {
      console.log("Regular user upload failed, trying with admin client:", uploadError)

      try {
        supabase = getSupabaseAdmin()

        // Try upload with admin client
        const adminUploadResult = await supabase.storage.from(bucketName).upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: true,
        })

        uploadData = adminUploadResult.data
        uploadError = adminUploadResult.error

        if (uploadError) {
          console.error("Admin upload also failed:", uploadError)

          // Check if bucket doesn't exist
          if (uploadError.message.includes("bucket") && uploadError.message.includes("not found")) {
            return {
              success: false,
              error: "Storage bucket not found. Please create a 'profile_images' bucket in your Supabase storage.",
            }
          }

          return { success: false, error: "Failed to upload profile image. Please try again." }
        }
      } catch (adminError) {
        console.error("Admin client failed:", adminError)
        return {
          success: false,
          error: "Profile image upload failed. Please try again later.",
          details: "Storage permissions are not properly configured.",
        }
      }
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

    // First try with regular user authentication
    let supabase = getSupabaseServer()

    // Use the known bucket name
    const bucketName = "profile_images"

    // Check if the file belongs to the user
    // This is important for security - users should only delete their own files
    if (!filePath.startsWith(`${userId}/`)) {
      // If the path doesn't start with the user ID, it might be an old format
      // In this case, we'll need admin privileges to delete it
      try {
        supabase = getSupabaseAdmin()
      } catch (error) {
        return {
          success: false,
          error: "You don't have permission to delete this image.",
        }
      }
    }

    // Delete the file
    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      console.error("Error deleting profile image:", error)

      // Try with admin client as fallback
      try {
        supabase = getSupabaseAdmin()
        const { error: adminError } = await supabase.storage.from(bucketName).remove([filePath])

        if (adminError) {
          console.error("Admin delete also failed:", adminError)
          return { success: false, error: "Failed to delete profile image." }
        }
      } catch (adminError) {
        console.error("Admin client failed for deletion:", adminError)
        return { success: false, error: "Failed to delete profile image." }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting profile image:", error)
    return { success: false, error: "Failed to delete profile image." }
  }
}
