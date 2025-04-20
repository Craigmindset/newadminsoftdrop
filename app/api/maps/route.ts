import { type NextRequest, NextResponse } from "next/server"

// Get the API key from environment variables (server-side only)
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    // Handle different map-related actions
    switch (action) {
      case "geocode":
        return handleGeocode(searchParams)
      case "reverse-geocode":
        return handleReverseGeocode(searchParams)
      case "place-details":
        return handlePlaceDetails(searchParams)
      case "autocomplete":
        return handleAutocomplete(searchParams)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Maps API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle geocoding requests (address to coordinates)
async function handleGeocode(params: URLSearchParams) {
  const address = params.get("address")
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${GOOGLE_MAPS_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  return NextResponse.json(data)
}

// Handle reverse geocoding requests (coordinates to address)
async function handleReverseGeocode(params: URLSearchParams) {
  const lat = params.get("lat")
  const lng = params.get("lng")

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  return NextResponse.json(data)
}

// Handle place details requests
async function handlePlaceDetails(params: URLSearchParams) {
  const placeId = params.get("placeId")

  if (!placeId) {
    return NextResponse.json({ error: "Place ID is required" }, { status: 400 })
  }

  const fields = params.get("fields") || "formatted_address,geometry,name"

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_MAPS_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  return NextResponse.json(data)
}

// Handle place autocomplete requests
async function handleAutocomplete(params: URLSearchParams) {
  const input = params.get("input")

  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input,
  )}&key=${GOOGLE_MAPS_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  return NextResponse.json(data)
}
