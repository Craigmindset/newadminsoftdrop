"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import useNotifications from "@/hooks/use-notifications"

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void
  placeholder: string
  className?: string
  defaultValue?: string
  showCurrentLocation?: boolean
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
  showCurrentLocation = false,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false)
  const { addNotification } = useNotifications()

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

    // Improve mobile experience by setting sessionToken
    const sessionToken = new window.google.maps.places.AutocompleteSessionToken()
    autocomplete.setOptions({ sessionToken })

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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      addNotification({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        type: "error",
      })
      return
    }

    setGettingCurrentLocation(true)

    // Show feedback to user
    addNotification({
      title: "Getting your location",
      description: "Please allow location access when prompted",
      type: "info",
    })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          if (!window.google?.maps) {
            throw new Error("Google Maps not loaded")
          }

          const { latitude, longitude } = position.coords
          const geocoder = new window.google.maps.Geocoder()

          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
              setGettingCurrentLocation(false)

              if (status === "OK" && results[0]) {
                const place = {
                  formatted_address: results[0].formatted_address,
                  geometry: {
                    location: {
                      lat: () => latitude,
                      lng: () => longitude,
                    },
                  },
                } as google.maps.places.PlaceResult

                setValue(results[0].formatted_address)
                onPlaceSelect(place)

                addNotification({
                  title: "Location found",
                  description: "Your current location has been set as the pickup point",
                  type: "success",
                })
              } else {
                addNotification({
                  title: "Error",
                  description: "Couldn't find address for your location",
                  type: "error",
                })
              }
            },
          )
        } catch (error) {
          setGettingCurrentLocation(false)
          addNotification({
            title: "Error",
            description: "Failed to get your current location",
            type: "error",
          })
        }
      },
      (error) => {
        setGettingCurrentLocation(false)
        let errorMessage = "Failed to get your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services in your device settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please try again."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again."
            break
        }

        addNotification({
          title: "Error",
          description: errorMessage,
          type: "error",
        })
      },
      // Optimize for mobile: increase timeout and reduce accuracy requirements
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    )
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={`${className} pr-10`} // Add padding for the loading indicator
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading || gettingCurrentLocation}
            // Improve mobile experience
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {showCurrentLocation && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={getCurrentLocation}
            disabled={loading || gettingCurrentLocation}
            title="Use current location"
            className="flex-shrink-0 h-10 w-10" // Ensure consistent size on mobile
          >
            {gettingCurrentLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
