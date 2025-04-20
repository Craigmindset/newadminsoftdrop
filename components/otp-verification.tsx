"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyOtp, sendOtp } from "@/app/actions/auth"
import { useToast } from "@/components/ui/use-toast"

interface OtpVerificationProps {
  phoneNumber: string
  onVerified: () => void
}

export function OtpVerification({ phoneNumber, onVerified }: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(120) // 2 minutes
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const { toast } = useToast()

  // Start countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCountdown])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1) // Only take the first character

    setOtp(newOtp)

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

    if (pastedData) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)

      // Focus the last filled input or the next empty one
      const lastIndex = Math.min(pastedData.length, 5)
      inputRefs.current[lastIndex]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits of the verification code.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await verifyOtp(phoneNumber, otpString)

      if (result.success) {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified.",
        })
        onVerified()
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Invalid verification code.",
          variant: "destructive",
        })
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

  const handleResendOtp = async () => {
    if (!canResend) return

    try {
      setCanResend(false)

      const result = await sendOtp(phoneNumber)

      if (result.success) {
        setResendCountdown(120) // Reset countdown to 2 minutes
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your phone.",
        })
      } else {
        setCanResend(true)
        toast({
          title: "Error",
          description: result.error || "Failed to resend verification code.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setCanResend(true)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400 mb-4">Enter the 6-digit code sent to {phoneNumber}</div>

      <div className="flex justify-between gap-2 mb-4">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-12 text-center text-lg bg-gray-800 border-gray-700 text-white"
            disabled={isSubmitting}
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        className="w-full bg-white text-black hover:bg-gray-200"
        disabled={isSubmitting || otp.join("").length !== 6}
      >
        {isSubmitting ? "Verifying..." : "Verify"}
      </Button>

      <div className="text-center mt-4">
        <div className="text-sm text-gray-400 mb-2">Didn't receive the code?</div>
        {canResend ? (
          <Button variant="link" onClick={handleResendOtp} className="text-white p-0 h-auto">
            Resend Code
          </Button>
        ) : (
          <div className="text-sm text-gray-400">
            Resend code in {Math.floor(resendCountdown / 60)}:{(resendCountdown % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  )
}
