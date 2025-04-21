"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define the profile type
export type Profile = {
  id?: string
  user_id: string
  phone_number: string
  full_name?: string
  email?: string
  address?: string
  profile_image_url?: string
  created_at?: string
  updated_at?: string
}

// Define the context type
type ProfileContextType = {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// Create a provider component
export function ProfileProvider({ children, initialProfile }: { children: ReactNode; initialProfile: Profile | null }) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [isLoading, setIsLoading] = useState(false)

  // Function to refresh the profile data
  const refreshProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// Create a hook to use the profile context
export function useProfileContext() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider")
  }
  return context
}
