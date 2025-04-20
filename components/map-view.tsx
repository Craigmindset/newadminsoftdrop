"use client"

import { useEffect, useRef } from "react"

interface MapViewProps {
  pickupLocation: {
    lat: number
    lng: number
    address: string
  }
  dropoffLocation: {
    lat: number
    lng: number
    address: string
  }
  carrierLocation: {
    lat: number
    lng: number
  }
  isPickupPhase: boolean
}

export function MapView({ pickupLocation, dropoffLocation, carrierLocation, isPickupPhase }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!window.google || !mapRef.current) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: carrierLocation,
        zoom: 12,
      })

      new window.google.maps.Marker({
        position: carrierLocation,
        map: map,
        label: "C",
      })

      new window.google.maps.Marker({
        position: pickupLocation,
        map: map,
        label: "P",
      })

      new window.google.maps.Marker({
        position: dropoffLocation,
        map: map,
        label: "D",
      })
    }

    initMap()
  }, [pickupLocation, dropoffLocation, carrierLocation, isPickupPhase])

  return <div ref={mapRef} className="w-full h-[300px]" />
}
