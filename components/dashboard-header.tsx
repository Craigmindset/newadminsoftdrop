"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Menu, User, Settings } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useState } from "react"
import { logoutSender } from "@/app/actions/sender-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfileContext } from "@/context/profile-context"

export function DashboardHeader() {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { profile } = useProfileContext()

  const closeSheet = () => {
    setIsSheetOpen(false)
  }

  const handleLogout = async () => {
    await logoutSender()
  }

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      const nameParts = profile.full_name.split(" ")
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      }
      return profile.full_name[0].toUpperCase()
    }
    return "U" // Default fallback
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-2 md:px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[90%] sm:w-[350px] h-full">
              <div className="h-full overflow-y-auto">
                <DashboardSidebar onMenuItemClick={closeSheet} />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softDrop-Logo2-ic9AJKo3HVkfKIi6LrZ2lC0gNc5TsO.png"
              alt="SoftDrop Logo"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="text-lg md:text-xl font-bold">SoftDrop</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.profile_image_url || ""} alt={profile?.full_name || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {profile?.full_name ? (
                  <div className="flex flex-col">
                    <span>{profile.full_name}</span>
                    {profile.email && <span className="text-xs text-muted-foreground">{profile.email}</span>}
                  </div>
                ) : (
                  "My Account"
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
