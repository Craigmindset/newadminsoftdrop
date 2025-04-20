"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LocationInputs() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would navigate to the next step or process the locations
    console.log("Pickup:", pickup, "Dropoff:", dropoff)
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="pl-10 py-6 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-xl"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Dropoff Location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="pl-10 py-6 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-xl"
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
