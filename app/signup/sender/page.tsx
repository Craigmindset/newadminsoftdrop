"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Phone, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { OtpVerification } from "@/components/otp-verification"
import { CreatePin } from "@/components/create-pin"
import { useToast } from "@/components/ui/use-toast"
import { sendOtp } from "@/app/actions/auth"

export default function SenderSignupPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [formattedPhone, setFormattedPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp" | "pin">("phone")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const [configError, setConfigError] = useState<{
    error: string
    solution: string
    details?: string
  } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 11 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setPhoneNumber(value)

    // Clear error when user types
    if (phoneError) setPhoneError("")
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setConfigError(null)

    // Validate phone number
    if (phoneNumber.length !== 11) {
      setPhoneError("Phone number must be 11 digits")
      return
    }

    setIsSubmitting(true)

    try {
      // Format phone number for international format (Nigeria)
      const formatted = phoneNumber.startsWith("0") ? `+234${phoneNumber.slice(1)}` : `+234${phoneNumber}`

      setFormattedPhone(formatted)

      const result = await sendOtp(formatted)

      if (result.success) {
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your phone.",
        })
        setStep("otp")
      } else {
        // Check if it's a configuration error
        if (result.solution) {
          setConfigError({
            error: result.error || "Authentication service error",
            solution: result.solution,
            details: result.details,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to send verification code.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpVerified = () => {
    setStep("pin")
  }

  const handlePinCreated = () => {
    toast({
      title: "Congratulations!",
      description: "You have successfully registered.",
    })

    // Redirect to login after a short delay
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  // Check if the error is specifically about the Supabase URL or API key
  const isSupabaseUrlError = configError?.error?.includes("URL") || false
  const isSupabaseKeyError =
    configError?.error?.includes("API key") || configError?.error?.includes("Invalid API key") || false

  return (
    <div className="bg-black text-white flex min-h-screen items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md bg-gray-900 border border-gray-800 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-gray-400 hover:text-white"
              onClick={() => {
                if (step === "phone") {
                  router.push("/signup/options")
                } else if (step === "otp") {
                  setStep("phone")
                } else if (step === "pin") {
                  setStep("otp")
                }
              }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <CardTitle className="text-xl font-bold text-white">
              {step === "phone" && "Enter Phone Number"}
              {step === "otp" && "Verify Phone Number"}
              {step === "pin" && "Create PIN"}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            {step === "phone" && "We'll send a verification code to this number"}
            {step === "otp" && "Enter the 6-digit code sent to your phone"}
            {step === "pin" && "Create a 6-digit PIN to secure your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configError && (
            <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                <p>{configError.error}</p>
                {configError.details && <p className="text-xs mt-1 text-red-300">Details: {configError.details}</p>}
                <p className="text-xs mt-2 font-semibold">Solution: {configError.solution}</p>

                {isSupabaseUrlError && (
                  <div className="mt-3 text-xs">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                      <li>Go to your Supabase dashboard</li>
                      <li>Navigate to Project Settings → API</li>
                      <li>Copy the "Project URL" (should start with https://)</li>
                      <li>Add it to your environment variables</li>
                    </ol>
                    <Button size="sm" variant="outline" className="mt-2 text-xs h-7" asChild>
                      <a href="/admin/config" target="_blank" rel="noopener noreferrer">
                        View Configuration Guide
                      </a>
                    </Button>
                  </div>
                )}

                {isSupabaseKeyError && (
                  <div className="mt-3 text-xs">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal pl-4 mt-1 space-y-1">
                      <li>Go to your Supabase dashboard</li>
                      <li>Navigate to Project Settings → API</li>
                      <li>Copy the "anon" public key (starts with "ey")</li>
                      <li>Add it to your environment variables</li>
                    </ol>
                    <Button size="sm" variant="outline" className="mt-2 text-xs h-7" asChild>
                      <a href="/admin/config" target="_blank" rel="noopener noreferrer">
                        View Configuration Guide
                      </a>
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Phone Number
                </Label>
                <div className="flex">
                  <Button
                    variant="outline"
                    type="button"
                    className="rounded-r-none px-3 bg-gray-800 border-gray-700 text-white"
                    disabled
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter your 11-digit phone number"
                    className="rounded-l-none bg-gray-800 border-gray-700 text-white"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                    pattern="[0-9]{11}"
                    minLength={11}
                    maxLength={11}
                    onKeyPress={(e) => {
                      // Allow only numeric input
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
                {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isSubmitting || phoneNumber.length !== 11}
              >
                {isSubmitting ? "Sending..." : "Continue"}
              </Button>
            </form>
          )}

          {step === "otp" && <OtpVerification phoneNumber={formattedPhone} onVerified={handleOtpVerified} />}

          {step === "pin" && <CreatePin phoneNumber={formattedPhone} onPinCreated={handlePinCreated} />}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
