"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDebounce } from "@/hooks/use-debounce"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Coordinates {
  lat: number
  lng: number
}

interface PlaceResult {
  formatted_address: string
  name?: string
  place_id?: string
  geometry: {
    location: Coordinates
  }
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceResult, coordinates: Coordinates) => void
  placeholder: string
  className?: string
  defaultValue?: string
  showCurrentLocation?: boolean
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
  const debouncedValue = useDebounce(value, 300)
  const [loading, setLoading] = useState(false)
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false)
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch place suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setSuggestions([])
        return
      }

      try {
        setLoading(true)

        // Use our server API endpoint for geocoding
        const response = await fetch(`/api/maps?action=geocode&address=${encodeURIComponent(debouncedValue)}`)
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const formattedSuggestions = data.results.map((result: any) => ({
            formatted_address: result.formatted_address,
            place_id: result.place_id,
            geometry: {
              location: {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
              },
            },
          }))
          setSuggestions(formattedSuggestions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        toast({
          title: "Error",
          description: "Failed to fetch address suggestions",
          variant: "destructive",
        })
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedValue, toast])

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: PlaceResult) => {
    setValue(suggestion.formatted_address)
    setShowSuggestions(false)

    const coordinates = {
      lat: suggestion.geometry.location.lat,
      lng: suggestion.geometry.location.lng,
    }

    onPlaceSelect(suggestion, coordinates)
  }

  // Get current location and reverse geocode
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
      return
    }

    setGettingCurrentLocation(true)

    // Show feedback to user
    toast({
      title: "Getting your location",
      description: "Please allow location access when prompted",
    })

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const coordinates = { lat: latitude, lng: longitude }

          try {
            // Use our server API to reverse geocode
            const response = await fetch(`/api/maps?action=reverse-geocode&lat=${latitude}&lng=${longitude}`)
            const data = await response.json()

            if (data.results && data.results.length > 0) {
              // Find the most detailed result
              const mostDetailedResult = data.results.reduce((prev: any, current: any) => {
                return current.address_components.length > prev.address_components.length ? current : prev
              }, data.results[0])

              const place = {
                formatted_address: mostDetailedResult.formatted_address,
                place_id: mostDetailedResult.place_id,
                geometry: {
                  location: coordinates,
                },
              }

              setValue(place.formatted_address)
              onPlaceSelect(place, coordinates)

              toast({
                title: "Location found",
                description: "Your current location has been set as the pickup point",
              })
            } else {
              throw new Error("No address found")
            }
          } catch (error) {
            // If we can't get a precise address, use a generic one with the coordinates
            const place = {
              formatted_address: `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              geometry: {
                location: coordinates,
              },
            }

            setValue(place.formatted_address)
            onPlaceSelect(place, coordinates)

            toast({
              title: "Location found",
              description: "Using your exact location as the pickup point",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to get your current location",
            variant: "destructive",
          })
        } finally {
          setGettingCurrentLocation(false)
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

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      },
      // Use high accuracy for the most precise location
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (apiError) {
    return (
      <div className="space-y-2 w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Maps API Error</AlertTitle>
          <AlertDescription>{apiError}. Please check your API key configuration.</AlertDescription>
        </Alert>
        <Input
          placeholder={placeholder}
          className={`${className} w-full`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full space-y-2">
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`${className} pr-10 w-full`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            if (debouncedValue && debouncedValue.length >= 3) {
              setShowSuggestions(true)
            }
          }}
          disabled={gettingCurrentLocation}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id || index}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.formatted_address}
              </div>
            ))}
          </div>
        )}
      </div>

      {showCurrentLocation && (
        <div className="w-full">
          {/* Mobile version - shown only on small screens */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={gettingCurrentLocation}
            className="md:hidden w-full flex items-center justify-center"
          >
            {gettingCurrentLocation ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Use current location
          </Button>

          {/* Desktop version - shown only on md screens and up */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={getCurrentLocation}
                  disabled={gettingCurrentLocation}
                  className="hidden md:flex flex-shrink-0 h-10 w-10"
                >
                  {gettingCurrentLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use my current location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
