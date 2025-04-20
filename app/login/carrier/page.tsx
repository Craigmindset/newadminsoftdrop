"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Phone } from "lucide-react"
import { authenticateCarrier } from "@/app/actions/carrier-auth"

export default function CarrierLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 11 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setPhoneNumber(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setPassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate phone number and password
    if (phoneNumber.length !== 11) {
      setError("Phone number must be 11 digits")
      return
    }

    if (password.length !== 6) {
      setError("Password must be 6 digits")
      return
    }

    setIsLoading(true)

    try {
      // Authenticate with carrier auth function
      const result = await authenticateCarrier(phoneNumber, password)

      if (!result.success) {
        setError(result.error || "Authentication failed")
        setIsLoading(false)
        return
      }

      // Successful login - use hard navigation for better cookie handling
      if (result.redirectUrl) {
        // Use window.location for hard navigation instead of router.push
        window.location.href = result.redirectUrl
      } else {
        // Fallback to client-side navigation if redirectUrl is not provided
        console.log("Login successful, redirecting to carrier dashboard...")
        window.location.href = "/carrier/dashboard"
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Login failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-500">Enter your phone number and password</p>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0812 345 6789"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="h-14 w-full rounded-md border border-gray-200 pl-12 pr-4 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                maxLength={11}
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="6-digit password"
                value={password}
                onChange={handlePasswordChange}
                maxLength={6}
                inputMode="numeric"
                required
                className="h-14 w-full rounded-md border border-gray-200 px-4 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-md bg-green-500 text-lg font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-green-500 hover:text-green-600">
            Forgot password?
          </Link>
        </div>

        <div className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup/carrier" className="font-medium text-green-500 hover:text-green-600">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
