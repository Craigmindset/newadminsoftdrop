"use server"

// Get the API key from environment variables (server-side only)
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

// Generate a signed URL for Google Maps embed
export async function getMapEmbedUrl(latitude: number, longitude: number, zoom = 17) {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not configured")
  }

  return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=${zoom}`
}
