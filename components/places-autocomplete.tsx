"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void
  placeholder: string
  className?: string
  defaultValue?: string
}

declare global {
  interface Window {
    google?: any
  }
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  placeholder,
  className,
  defaultValue = "",
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load the Google Maps script
  useEffect(() => {
    if (window.google?.maps?.places) {
      setScriptLoaded(true)
      return
    }

    setLoading(true)
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD72etivyT_7MQfVKR44l_R01R6J7xAB-Q&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setScriptLoaded(true)
      setLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      // Clean up script if component unmounts before script loads
      if (!scriptLoaded) {
        document.head.removeChild(script)
      }
    }
  }, [scriptLoaded])

  // Initialize autocomplete
  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["address_components", "formatted_address", "geometry", "name"],
      types: ["address"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place) {
        setValue(place.formatted_address || place.name || "")
        onPlaceSelect(place)
      }
    })

    return () => {
      // Clean up Google Maps event listeners
      window.google.maps.event.clearInstanceListeners(autocomplete)
    }
  }, [scriptLoaded, onPlaceSelect])

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
