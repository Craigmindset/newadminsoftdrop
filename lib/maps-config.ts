// Google Maps API configuration - Server-side only
// We don't expose the API key to the client anymore

// Check if we're in a server component/action
export const isServerEnvironment = () => {
  return typeof window === "undefined"
}

// Helper function to check if Maps API can be used on the server
export const canUseMapsApiOnServer = () => {
  if (!isServerEnvironment()) {
    console.warn("This function should only be called from server components or actions")
    return false
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  return Boolean(apiKey && apiKey.length > 10)
}

// For client-side, we'll use a different approach without exposing the API key
export const isClientMapsConfigured = () => {
  // This doesn't check the actual API key, just whether the client can use maps
  // The actual API key will be handled by server endpoints
  return true
}

// Helper function for client-side to check if Google Maps is loaded
export const loadGoogleMapsScript = () => {
  if (typeof window === "undefined") return false
  return Boolean(window.google && window.google.maps)
}
