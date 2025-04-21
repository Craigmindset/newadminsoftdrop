"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Phone, Lock, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Placeholder for authenticateCarrier function (replace with your actual implementation)
async function authenticateCarrier(phone: string, pin: string): Promise<{ success: boolean; error?: string }> {
  // Simulate authentication logic
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network request

  if (phone === "+2348012345678" && pin === "123456") {
    return { success: true }
  } else {
    return { success: false, error: "Invalid phone number or PIN" }
  }
}

export default function CarrierLoginPage() {
  const [showPin, setShowPin] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 11 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setPhoneNumber(value)
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setPin(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate phone number and PIN
    if (phoneNumber.length !== 11) {
      setError("Phone number must be 11 digits")
      return
    }

    if (pin.length !== 6) {
      setError("PIN must be 6 digits")
      return
    }

    setIsLoading(true)

    try {
      // Format the phone number for authentication
      const formattedPhone = phoneNumber.startsWith("0") ? `+234${phoneNumber.slice(1)}` : `+234${phoneNumber}`

      // Call the authenticateCarrier function
      const result = await authenticateCarrier(formattedPhone, pin)

      if (result.success) {
        console.log("Login successful, redirecting to carrier dashboard...")
        router.push("/carrier/dashboard")
      } else {
        setError(result.error || "Invalid phone number or PIN")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Truck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Carrier Login</CardTitle>
          <CardDescription className="text-center">
            Enter your phone number and PIN to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (11 digits)</Label>
              <div className="flex">
                <Button variant="outline" type="button" className="rounded-r-none px-3" disabled>
                  <Phone className="h-4 w-4" />
                </Button>
                <Input
                  id="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your 11-digit phone number"
                  className="rounded-l-none"
                  required
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>
              {phoneNumber && phoneNumber.length !== 11 && (
                <p className="text-sm text-destructive mt-1">Phone number must be 11 digits</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pin">PIN (6 digits)</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot PIN?
                </Link>
              </div>
              <div className="relative flex">
                <Button variant="outline" type="button" className="rounded-r-none px-3" disabled>
                  <Lock className="h-4 w-4" />
                </Button>
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="Enter your 6-digit PIN"
                  className="rounded-l-none"
                  required
                  value={pin}
                  onChange={handlePinChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPin ? "Hide PIN" : "Show PIN"}</span>
                </Button>
              </div>
              {pin && pin.length !== 6 && <p className="text-sm text-destructive mt-1">PIN must be 6 digits</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || phoneNumber.length !== 11 || pin.length !== 6}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup/carrier" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
