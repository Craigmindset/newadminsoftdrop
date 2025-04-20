import { getSenderProfile } from "@/app/actions/update-profile"
import ProfileForm from "@/components/profile-form"
import { UserProfileHeader } from "@/components/user-profile-header"

export default async function ProfilePage() {
  // Fetch the user's profile data
  const profile = await getSenderProfile()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* User Profile Header - Shows the current profile information */}
      <UserProfileHeader profile={profile} />

      {/* Profile Form - For editing profile information */}
      <ProfileForm initialData={profile} />
    </div>
  )
}
