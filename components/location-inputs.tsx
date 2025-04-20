"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PlacesAutocomplete from "@/components/places-autocomplete"

declare global {
  interface Window {
    google: any
  }
}

export default function LocationInputs() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [pickupCoordinates, setPickupCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoordinates, setDropoffCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const handlePickupPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setPickup(place.formatted_address)
    }
    if (place.geometry?.location) {
      setPickupCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    }
  }

  const handleDropoffPlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setDropoff(place.formatted_address)
    }
    if (place.geometry?.location) {
      setDropoffCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would navigate to the next step or process the locations
    console.log("Pickup:", pickup, pickupCoordinates)
    console.log("Dropoff:", dropoff, dropoffCoordinates)
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <PlacesAutocomplete
            placeholder="Pickup Location"
            onPlaceSelect={handlePickupPlaceSelect}
            className="pl-10 py-6 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-xl"
            defaultValue={pickup}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative">
          <PlacesAutocomplete
            placeholder="Dropoff Location"
            onPlaceSelect={handleDropoffPlaceSelect}
            className="pl-10 py-6 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-xl"
            defaultValue={dropoff}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <Link href="/signup" className="block mt-9">
          <Button type="submit" className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl">
            Get Started
          </Button>
        </Link>
      </form>
    </div>
  )
}
