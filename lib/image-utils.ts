/**
 * Validates an image file based on size and type
 * @param file The file to validate
 * @param maxSizeInBytes Maximum file size in bytes
 * @param allowedTypes Array of allowed MIME types
 * @returns An object with validation result and error message if any
 */
export function validateImage(
  file: File,
  maxSizeInBytes: number = 5 * 1024 * 1024, // 5MB default
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif"],
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${(maxSizeInBytes / (1024 * 1024)).toFixed(1)}MB`,
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.map((type) => type.replace("image/", "")).join(", ")}`,
    }
  }

  return { valid: true }
}

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Generates initials from a name
 * @param name Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name?: string): string {
  if (!name) return "U"

  const nameParts = name.trim().split(/\s+/)
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
  }
  return name[0].toUpperCase()
}
