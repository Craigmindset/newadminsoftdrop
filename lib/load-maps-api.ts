// Utility function to load Google Maps API dynamically
let isLoading = false
let isLoaded = false
const callbacks: Array<() => void> = []

export function loadGoogleMapsApi(): Promise<void> {
  // Return existing promise if already loaded
  if (isLoaded) return Promise.resolve()

  // Check if the API is already loaded
  if (typeof window !== "undefined" && window.google && window.google.maps) {
    isLoaded = true
    return Promise.resolve()
  }

  // If we're already loading, return a promise that resolves when loaded
  if (isLoading) {
    return new Promise<void>((resolve) => {
      callbacks.push(resolve)
    })
  }

  // Start loading
  isLoading = true

  return new Promise<void>((resolve, reject) => {
    try {
      // Add callback to the queue
      callbacks.push(resolve)

      // Fetch the script URL from our secure endpoint
      fetch("/api/maps/script-url")
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error)
          }

          // Create the script element
          const script = document.createElement("script")

          // Set the callback function
          window.initMap = () => {
            isLoaded = true
            isLoading = false

            // Execute all callbacks
            callbacks.forEach((cb) => cb())
            callbacks.length = 0
          }

          // Set script attributes following Google's best practices
          script.src = `${data.url}&callback=initMap&loading=async`
          script.defer = true
          script.async = true

          // Handle errors
          script.onerror = () => {
            isLoading = false
            reject(new Error("Failed to load Google Maps API"))
          }

          // Append to document
          document.head.appendChild(script)
        })
        .catch((error) => {
          isLoading = false
          reject(error)
        })
    } catch (error) {
      isLoading = false
      reject(error)
    }
  })
}

// Type definition for the global initMap function
declare global {
  interface Window {
    initMap: () => void
  }
}
