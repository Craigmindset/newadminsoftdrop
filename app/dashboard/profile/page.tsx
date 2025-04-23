import { getSenderProfile } from "@/app/actions/update-profile"
import ProfileForm from "@/app/components/profile-form"
import { cookies } from "next/headers"

export default async function ProfilePage() {
  // Fetch the user's profile data
  const profile = await getSenderProfile()

  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <ProfileForm initialData={profile} userId={userId || ""} />
    </div>
  )
}
