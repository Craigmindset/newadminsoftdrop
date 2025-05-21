"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface CarrierCreatePasswordProps {
  onPasswordCreated: () => void
  phoneNumber: string
}

export function CarrierCreatePassword({ onPasswordCreated, phoneNumber }: CarrierCreatePasswordProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [pinsMatch, setPinsMatch] = useState<boolean | null>(null)
  const router = useRouter()

  // Check if PINs match whenever either PIN changes
  useEffect(() => {
    if (password && confirmPassword) {
      setPinsMatch(password === confirmPassword)
    } else {
      setPinsMatch(null)
    }
  }, [password, confirmPassword])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setPassword(value)
  }

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setConfirmPassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "PINs don't match",
        description: "Please make sure your PINs match.",
        variant: "destructive",
      })
      return
    }

    if (password.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 6 digits.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate successful password creation
      toast({
        title: "Success",
        description: "Password created successfully!",
      })
      onPasswordCreated()
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Create 6-digit PIN</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            inputMode="numeric"
            placeholder="Enter 6-digit PIN"
            className="pr-10"
            required
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            value={password}
            onChange={handlePinChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault()
              }
            }}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm PIN</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            inputMode="numeric"
            placeholder="Confirm 6-digit PIN"
            className="pr-10"
            required
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            value={confirmPassword}
            onChange={handleConfirmPinChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault()
              }
            }}
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || password !== confirmPassword || password.length !== 6}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}
