"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SenderSignup() {
  const [phone, setPhone] = useState("")
  const [formattedPhone, setFormattedPhone] = useState("")
  const router = useRouter()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "")
    if (input.length <= 11) {
      setPhone(input)
      // Format with spaces as user types
      let formattedValue = input
      if (input.length > 3) {
        formattedValue = input.substring(0, 4) + " " + input.substring(4)
      }
      if (input.length > 7) {
        formattedValue = formattedValue.substring(0, 8) + " " + formattedValue.substring(8)
      }
      e.target.value = formattedValue.trim()
    }
  }

  useEffect(() => {
    if (phone.length === 11) {
      const formatted = `+234${phone.substring(1)}`
      setFormattedPhone(formatted)
    } else {
      setFormattedPhone("")
    }
  }, [phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length !== 11) return
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) throw error
      
      router.push(`/signup/sender/verify?phone=${encodeURIComponent(formattedPhone)}`)
    } catch (err) {
      console.error("Error sending OTP:", err)
      router.push(`/signup/sender/verify?phone=${encodeURIComponent(formattedPhone)}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Enter Phone Number
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We'll send a verification code to this number
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0812 345 6789"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="h-12 pl-10 text-lg"
                maxLength={11}
              />
            </div>
            {phone.length > 0 && phone.length < 11 && (
              <p className="text-xs text-red-500">Please enter 11 digits</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-medium"
            disabled={phone.length !== 11}
          >
            Continue
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-700"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
