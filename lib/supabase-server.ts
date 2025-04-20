import { createClient } from "@supabase/supabase-js"

// Function to clean up the URL if it contains the variable name
function cleanupUrl(url: string | undefined): string | undefined {
  if (!url) return undefined

  // Check if the URL contains the variable name and extract the actual URL
  if (url.includes("NEXT_PUBLIC_SUPABASE_URL=")) {
    const match = url.match(/NEXT_PUBLIC_SUPABASE_URL=(https:\/\/.+)/)
    return match ? match[1] : url
  }

  return url
}

// Function to clean up the API key if it contains the variable name
function cleanupApiKey(key: string | undefined): string | undefined {
  if (!key) return undefined

  // Check if the key contains the variable name and extract the actual key
  if (key.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
    const match = key.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^=\s]+)/)
    return match ? match[1] : key
  }

  return key
}

// Function to validate Supabase URL format
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false

  // Clean up the URL first
  const cleanedUrl = cleanupUrl(url)

  // Basic format check
  if (!cleanedUrl?.startsWith("https://")) {
    console.error("Supabase URL must start with https://", cleanedUrl)
    return false
  }

  try {
    // Check if it's a valid URL
    new URL(cleanedUrl)
    return true
  } catch (error) {
    console.error("Invalid URL format:", error)
    return false
  }
}

// Function to validate Supabase API key format
function isValidSupabaseKey(key: string | undefined): boolean {
  if (!key) return false

  // Clean up the key first
  const cleanedKey = cleanupApiKey(key)

  // Basic format check for JWT tokens (they start with "ey")
  if (!cleanedKey?.startsWith("ey")) {
    console.error('Supabase API key should start with "ey"')
    return false
  }

  // Check minimum length
  if (cleanedKey.length < 30) {
    console.error("Supabase API key is too short")
    return false
  }

  return true
}

// Function to get Supabase client for server components/actions
export function getSupabaseServer() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if URL is defined
  if (!supabaseUrl) {
    throw new Error("Supabase URL is missing. Please set NEXT_PUBLIC_SUPABASE_URL environment variable.")
  }

  // Clean up the URL if needed
  supabaseUrl = cleanupUrl(supabaseUrl)

  // Validate URL format
  if (!isValidSupabaseUrl(supabaseUrl)) {
    throw new Error(
      `Invalid Supabase URL format: "${supabaseUrl}". URL must start with https:// and be properly formatted.`,
    )
  }

  // Check if key is defined
  if (!supabaseKey) {
    throw new Error("Supabase API Key is missing. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.")
  }

  // Clean up the key if needed
  supabaseKey = cleanupApiKey(supabaseKey)

  // Validate key format
  if (!isValidSupabaseKey(supabaseKey)) {
    throw new Error(`Invalid Supabase API Key format. API key must start with "ey" and be at least 30 characters long.`)
  }

  // Log the first few characters of the key for debugging (don't log the full key for security)
  console.log(`Using Supabase key starting with: ${supabaseKey.substring(0, 10)}...`)

  try {
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw new Error(`Failed to create Supabase client: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Types
export type SenderProfile = {
  id?: string
  user_id: string
  phone_number: string
  created_at?: string
  updated_at?: string
  full_name?: string
  email?: string
  address?: string
}
