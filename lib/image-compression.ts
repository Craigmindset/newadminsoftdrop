/**
 * Image compression utility for optimizing images before upload
 */

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: string
}

/**
 * Compresses an image file using canvas
 *
 * @param file The image file to compress
 * @param options Compression options
 * @returns A promise that resolves to a compressed Blob
 */
export async function compressImage(file: File | Blob, options: CompressionOptions = {}): Promise<Blob> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8, mimeType = "image/jpeg" } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Release the object URL
      URL.revokeObjectURL(img.src)

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      // Create canvas and draw the resized image
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw the image with white background (for transparent PNGs)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"))
            return
          }
          resolve(blob)
        },
        mimeType,
        quality,
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    // Set crossOrigin to anonymous to avoid CORS issues
    img.crossOrigin = "anonymous"
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Gets image dimensions without loading the full image
 *
 * @param file The image file
 * @returns A promise that resolves to the image dimensions
 */
export async function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error("Failed to load image for dimension calculation"))
    }
    img.src = URL.createObjectURL(file)
  })
}
