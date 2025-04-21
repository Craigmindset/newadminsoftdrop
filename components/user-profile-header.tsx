import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Mail, Phone } from "lucide-react"

type SenderProfile = {
  id?: string
  user_id: string
  phone_number: string
  created_at?: string
  updated_at?: string
  full_name?: string
  email?: string
  address?: string
  profile_image_url?: string
}

interface UserProfileHeaderProps {
  profile: SenderProfile | null
}

export function UserProfileHeader({ profile }: UserProfileHeaderProps) {
  // If no profile data is available yet, show a placeholder
  if (!profile) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Complete your profile information below</p>
        </CardContent>
      </Card>
    )
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!profile.full_name) return "U"
    return profile.full_name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24 border">
            <AvatarImage
              src={profile.profile_image_url || ""}
              alt={profile.full_name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name || "User"}</h2>
              <p className="text-muted-foreground">
                Account created on {new Date(profile.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone_number}</span>
              </div>

              {profile.email && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              )}

              {profile.address && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
