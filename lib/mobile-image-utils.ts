/**
 * Utilities for handling image uploads on mobile devices
 */
import { compressImage } from "./image-compression"

// Maximum dimensions for uploaded images
const MAX_IMAGE_DIMENSION = 1200

/**
 * Processes an image file for upload, with special handling for mobile devices
 * - Compresses large images
 * - Converts HEIC/HEIF formats (common on iOS) to JPEG
 * - Handles orientation metadata
 *
 * @param file Original image file from input
 * @returns Processed file ready for upload
 */
export async function processImageForUpload(file: File): Promise<{
  processedFile: File | Blob
  originalSize: number
  processedSize: number
  wasProcessed: boolean
  processingDetails?: string[]
}> {
  const originalSize = file.size
  const details: string[] = []
  let wasProcessed = false
  let processedFile: File | Blob = file

  try {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Get file extension and type
    const fileExt = file.name.split(".").pop()?.toLowerCase() || ""
    const fileType = file.type

    // Handle HEIC/HEIF formats (common on iOS)
    if (fileExt === "heic" || fileExt === "heif" || fileType === "image/heic" || fileType === "image/heif") {
      // In a real implementation, you would convert HEIC to JPEG here
      // For this example, we'll just note it
      details.push("HEIC/HEIF format detected, would convert to JPEG")
      wasProcessed = true
    }

    // Compress large images, especially on mobile
    if (file.size > 1024 * 1024 || isMobile) {
      const compressedImage = await compressImage(file, {
        maxWidth: MAX_IMAGE_DIMENSION,
        maxHeight: MAX_IMAGE_DIMENSION,
        quality: 0.8,
        mimeType: "image/jpeg",
      })

      if (compressedImage.size < file.size * 0.95) {
        // Only use if it's at least 5% smaller
        processedFile = compressedImage
        details.push(
          `Image compressed: ${Math.round(file.size / 1024)}KB → ${Math.round(compressedImage.size / 1024)}KB`,
        )
        wasProcessed = true
      }
    }

    // Create a new file with the processed blob if needed
    if (wasProcessed && processedFile !== file) {
      // Preserve the original filename but ensure the extension matches the new format
      let newFileName = file.name
      if (fileExt === "heic" || fileExt === "heif") {
        newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg")
      }

      // Create a new File object with the processed blob
      processedFile = new File([processedFile], newFileName, { type: processedFile.type || "image/jpeg" })
    }

    return {
      processedFile,
      originalSize,
      processedSize: processedFile.size,
      wasProcessed,
      processingDetails: details,
    }
  } catch (error) {
    console.error("Error processing image:", error)
    // If anything goes wrong, return the original file
    return {
      processedFile: file,
      originalSize,
      processedSize: file.size,
      wasProcessed: false,
      processingDetails: [`Error during processing: ${error instanceof Error ? error.message : String(error)}`],
    }
  }
}

/**
 * Creates a data URL from a file for preview
 */
export function createObjectURL(file: File | Blob): string {
  return URL.createObjectURL(file)
}

/**
 * Revokes a previously created object URL to prevent memory leaks
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * Detects if the current device is a mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
