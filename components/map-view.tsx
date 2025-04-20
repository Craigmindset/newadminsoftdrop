"use client"

import { useEffect, useRef, useState } from "react"
import { Truck, MapPin, Navigation } from "lucide-react"

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
  carrierLocation?: {
    lat: number
    lng: number
  }
  isPickupPhase?: boolean
}

export function MapView({ pickupLocation, dropoffLocation, carrierLocation, isPickupPhase = false }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  // Simulate carrier movement
  useEffect(() => {
    if (!carrierLocation) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1
        return newProgress > 100 ? 100 : newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [carrierLocation])

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
      {/* This would be replaced with a real map in production */}
      <div
        ref={mapRef}
        className="w-full h-full relative"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5742773_2980960.jpg-bcDojpG6ZTlHKUJVt1AzBIt73NA2yd.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Pickup location marker */}
        <div
          className="absolute flex flex-col items-center z-10"
          style={{
            left: `${pickupLocation.lat}%`,
            top: `${pickupLocation.lng}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-green-500/90 text-white p-2 rounded-full shadow-lg">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="bg-white/90 px-3 py-1 rounded-full text-xs mt-1 shadow-md">Pickup</div>
        </div>

        {/* Dropoff location marker */}
        <div
          className="absolute flex flex-col items-center z-10"
          style={{
            left: `${dropoffLocation.lat}%`,
            top: `${dropoffLocation.lng}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-red-500/90 text-white p-2 rounded-full shadow-lg">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="bg-white/90 px-3 py-1 rounded-full text-xs mt-1 shadow-md">Dropoff</div>
        </div>

        {/* Carrier location marker */}
        {carrierLocation && (
          <div
            className="absolute flex flex-col items-center z-20"
            style={{
              left: isPickupPhase
                ? `${pickupLocation.lat - ((pickupLocation.lat - carrierLocation.lat) * progress) / 100}%`
                : `${pickupLocation.lat + ((dropoffLocation.lat - pickupLocation.lat) * progress) / 100}%`,
              top: isPickupPhase
                ? `${pickupLocation.lng - ((pickupLocation.lng - carrierLocation.lng) * progress) / 100}%`
                : `${pickupLocation.lng + ((dropoffLocation.lng - pickupLocation.lng) * progress) / 100}%`,
              transform: "translate(-50%, -50%)",
              transition: "left 1s, top 1s",
            }}
          >
            <div className="bg-blue-500/90 text-white p-2 rounded-full shadow-lg animate-pulse">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Path line */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <line
            x1={`${isPickupPhase ? carrierLocation?.lat || 0 : pickupLocation.lat}%`}
            y1={`${isPickupPhase ? carrierLocation?.lng || 0 : pickupLocation.lng}%`}
            x2={`${isPickupPhase ? pickupLocation.lat : dropoffLocation.lat}%`}
            y2={`${isPickupPhase ? pickupLocation.lng : dropoffLocation.lng}%`}
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="6,8"
            strokeLinecap="round"
            className="opacity-70"
          />
        </svg>

        {/* Map controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
            <Navigation className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
