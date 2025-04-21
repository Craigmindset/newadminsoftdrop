"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Menu, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
import { CarrierSidebar } from "@/components/carrier-sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Import the logoutCarrier function
import { logoutCarrier } from "@/app/actions/carrier-auth"

export function CarrierHeader() {
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const closeSheet = () => {
    setIsSheetOpen(false)
  }

  // Update the handleLogout function
  const handleLogout = async () => {
    // In a real app, you would handle logout logic here
    await logoutCarrier()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-1 sm:px-2 md:px-4">
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
                <CarrierSidebar onMenuItemClick={closeSheet} />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/carrier/dashboard" className="flex items-center gap-2">
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
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-1">
            <Switch
              id="online-mode"
              checked={isOnline}
              onCheckedChange={setIsOnline}
              className={`${isOnline ? "bg-green-500" : "bg-red-500"} data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500`}
            />
            <Label
              htmlFor="online-mode"
              className={`text-[10px] xs:text-xs md:text-sm font-medium whitespace-nowrap ${isOnline ? "text-green-500" : "text-red-500"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </Label>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/carrier/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/carrier/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
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
