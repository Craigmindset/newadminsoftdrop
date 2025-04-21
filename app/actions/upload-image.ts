"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

// Create a Supabase client with the service role key to bypass RLS
function getServiceSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    // Validate URL format
    if (!supabaseUrl) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
    }

    // Check if URL is valid
    try {
      new URL(supabaseUrl)
    } catch (error) {
      throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
    }

    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    throw new Error(`Supabase client initialization failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export type UploadResult = {
  success: boolean
  url?: string
  error?: string
  errorCode?: string
  details?: {
    originalSize?: number
    processedSize?: number
    wasProcessed?: boolean
    processingDetails?: string[]
    mimeType?: string
    fileName?: string
    uploadTime?: number
  }
}

export async function uploadProfileImage(formData: FormData): Promise<UploadResult> {
  const startTime = Date.now()
  try {
    // Get the session from cookies
    const sessionCookie = cookies().get("sb-session")
    if (!sessionCookie?.value) {
      return {
        success: false,
        error: "Not authenticated. Please log in again.",
        errorCode: "AUTH_NO_SESSION",
      }
    }

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch (error) {
      return {
        success: false,
        error: "Invalid session format. Please log in again.",
        errorCode: "AUTH_INVALID_SESSION",
      }
    }

    const userId = session.userId
    if (!userId) {
      return {
        success: false,
        error: "User ID not found in session. Please log in again.",
        errorCode: "AUTH_NO_USER_ID",
      }
    }

    // Get the file from the form data
    const file = formData.get("file") as File
    if (!file) {
      return {
        success: false,
        error: "No file provided",
        errorCode: "UPLOAD_NO_FILE",
      }
    }

    // Log file details for debugging
    console.log(`[Upload] File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`)

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        errorCode: "UPLOAD_FILE_TOO_LARGE",
        details: {
          originalSize: file.size,
          mimeType: file.type,
          fileName: file.name,
        },
      }
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
        errorCode: "UPLOAD_INVALID_FILE_TYPE",
        details: {
          mimeType: file.type,
          fileName: file.name,
        },
      }
    }

    // Get file buffer
    let buffer: ArrayBuffer
    try {
      buffer = await file.arrayBuffer()
      console.log(`[Upload] Successfully read file buffer of ${buffer.byteLength} bytes`)
    } catch (error) {
      console.error("[Upload] Error reading file buffer:", error)
      return {
        success: false,
        error: `Failed to read file data: ${error instanceof Error ? error.message : String(error)}`,
        errorCode: "UPLOAD_READ_ERROR",
        details: {
          mimeType: file.type,
          fileName: file.name,
        },
      }
    }

    // Initialize Supabase client
    const supabase = getServiceSupabase()

    // Generate a unique filename
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `${userId}/${uuidv4()}.${fileExt}`

    // Upload file to Supabase Storage
    console.log(`[Upload] Attempting to upload file to Supabase Storage: ${fileName}`)
    const { data, error } = await supabase.storage.from("profile_images").upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) {
      console.error("[Upload] Error uploading file to Supabase:", error)
      return {
        success: false,
        error: `Failed to upload image: ${error.message}`,
        errorCode: `STORAGE_UPLOAD_ERROR`,
        details: {
          originalSize: file.size,
          mimeType: file.type,
          fileName: file.name,
        },
      }
    }

    console.log("[Upload] File uploaded successfully:", data)

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("profile_images").getPublicUrl(fileName)
    console.log("[Upload] Public URL generated:", publicUrlData.publicUrl)

    // Update the user's profile with the new image URL
    const { error: updateError } = await supabase
      .from("sender_profiles")
      .update({
        profile_image_url: publicUrlData.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (updateError) {
      console.error("[Upload] Error updating profile with image URL:", updateError)
      return {
        success: false,
        error: `Failed to update profile with image URL: ${updateError.message}`,
        errorCode: `DB_UPDATE_ERROR`,
        details: {
          originalSize: file.size,
          mimeType: file.type,
          fileName: file.name,
        },
      }
    }

    const uploadTime = Date.now() - startTime
    console.log(`[Upload] Profile updated successfully. Total time: ${uploadTime}ms`)

    return {
      success: true,
      url: publicUrlData.publicUrl,
      details: {
        originalSize: file.size,
        mimeType: file.type,
        fileName: file.name,
        uploadTime,
      },
    }
  } catch (error) {
    console.error("[Upload] Unhandled exception in uploadProfileImage:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      errorCode: "UNHANDLED_EXCEPTION",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}
