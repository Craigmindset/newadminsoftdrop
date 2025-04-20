"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContactPickerProps {
  onContactSelect: (phoneNumber: string, name?: string) => void
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function ContactPicker({ onContactSelect, value, onChange, className }: ContactPickerProps) {
  const [isContactPickerSupported, setIsContactPickerSupported] = useState(false)
  const { toast } = useToast()

  // Check if Contact Picker API is supported
  useEffect(() => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      setIsContactPickerSupported(true)
    }
  }, [])

  const handleOpenContactPicker = async () => {
    try {
      // @ts-ignore - TypeScript doesn't have types for the Contact Picker API yet
      const contacts = await navigator.contacts.select(["tel"], { multiple: false })

      if (contacts.length > 0) {
        const contact = contacts[0]
        if (contact.tel && contact.tel.length > 0) {
          // Format the phone number (remove spaces, dashes, etc.)
          const phoneNumber = contact.tel[0].replace(/\D/g, "")

          // Update the input value
          onChange(phoneNumber)

          // Call the callback with the selected phone number and name
          onContactSelect(phoneNumber, contact.name ? contact.name[0] : undefined)

          toast({
            title: "Contact Selected",
            description: `${contact.name ? contact.name[0] : "Contact"} has been selected.`,
          })
        } else {
          toast({
            title: "No Phone Number",
            description: "The selected contact doesn't have a phone number.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error using Contact Picker:", error)
      toast({
        title: "Error",
        description: "Failed to access contacts. Please try again or enter the number manually.",
        variant: "destructive",
      })
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 11 digits
    const phoneNumber = e.target.value.replace(/\D/g, "").slice(0, 11)
    onChange(phoneNumber)
  }

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full">
        <Input
          type="tel"
          inputMode="numeric"
          placeholder="Enter receiver's phone number"
          className={className}
          value={value}
          onChange={handlePhoneChange}
          required
        />
      </div>

      {isContactPickerSupported && (
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenContactPicker}
          className="md:hidden w-full flex items-center justify-center"
          size="sm"
        >
          <Users className="h-4 w-4 mr-2" />
          Contacts
        </Button>
      )}

      {/* Desktop version - shown only on md screens and up */}
      {isContactPickerSupported && (
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenContactPicker}
          className="hidden md:flex flex-shrink-0"
        >
          <Users className="h-4 w-4 mr-2" />
          Contacts
        </Button>
      )}
    </div>
  )
}
