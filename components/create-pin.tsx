"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSender } from "@/app/actions/auth"
import { useToast } from "@/components/ui/use-toast"

interface CreatePinProps {
  phoneNumber: string
  onPinCreated: () => void
}

export function CreatePin({ phoneNumber, onPinCreated }: CreatePinProps) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pinsMatch, setPinsMatch] = useState<boolean | null>(null)
  const { toast } = useToast()

  // Check if PINs match whenever either PIN changes
  useEffect(() => {
    if (pin && confirmPin) {
      setPinsMatch(pin === confirmPin)
    } else {
      setPinsMatch(null)
    }
  }, [pin, confirmPin])

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setPin(value)
  }

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setConfirmPin(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please make sure your PINs match.",
        variant: "destructive",
      })
      return
    }

    if (pin.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 6 digits.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signUpSender(phoneNumber, pin)

      if (result.success) {
        toast({
          title: "Congratulations!",
          description: "You have successfully registered.",
        })
        onPinCreated()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create account.",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin" className="text-white">
          Create 6-digit PIN
        </Label>
        <div className="relative">
          <Input
            id="pin"
            type={showPin ? "text" : "password"}
            inputMode="numeric"
            placeholder="Enter 6-digit PIN"
            className={`bg-gray-800 border-gray-700 text-white pr-10 ${
              pinsMatch === true && pin.length === 6 ? "border-green-500" : pinsMatch === false ? "border-red-500" : ""
            }`}
            value={pin}
            onChange={handlePinChange}
            required
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            onKeyPress={(e) => {
              // Allow only numeric input
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault()
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
            onClick={() => setShowPin(!showPin)}
          >
            {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPin" className="text-white">
          Confirm PIN
        </Label>
        <div className="relative">
          <Input
            id="confirmPin"
            type={showConfirmPin ? "text" : "password"}
            inputMode="numeric"
            placeholder="Confirm 6-digit PIN"
            className={`bg-gray-800 border-gray-700 text-white pr-10 ${
              pinsMatch === true && confirmPin.length === 6
                ? "border-green-500"
                : pinsMatch === false
                  ? "border-red-500"
                  : ""
            }`}
            value={confirmPin}
            onChange={handleConfirmPinChange}
            required
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            onKeyPress={(e) => {
              // Allow only numeric input
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault()
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
            onClick={() => setShowConfirmPin(!showConfirmPin)}
          >
            {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* PIN match indicator */}
      {confirmPin.length > 0 && (
        <div className={`flex items-center text-sm ${pinsMatch ? "text-green-500" : "text-red-500"}`}>
          {pinsMatch ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              PINs match
            </>
          ) : (
            <>
              <X className="h-4 w-4 mr-1" />
              PINs don't match
            </>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-gray-200"
        disabled={isSubmitting || pin.length !== 6 || confirmPin.length !== 6 || pin !== confirmPin}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}
