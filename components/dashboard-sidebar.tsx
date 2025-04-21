"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookOpen, CreditCard, Home, LogOut, Package, Send, Truck, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useProfileContext } from "@/context/profile-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/image-utils"

interface DashboardSidebarProps {
  onMenuItemClick?: () => void
}

export function DashboardSidebar({ onMenuItemClick }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { profile } = useProfileContext()

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Send Item",
      href: "/dashboard/send",
      icon: Send,
    },
    {
      name: "Track Item",
      href: "/dashboard/shipments",
      icon: Package,
    },
    {
      name: "Wallet",
      href: "/dashboard/wallet",
      icon: CreditCard,
    },
    {
      name: "Carriers",
      href: "/dashboard/carriers",
      icon: Truck,
    },
    {
      name: "Sender Academy",
      href: "/sender-academy",
      icon: BookOpen,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Logout",
      href: "/",
      icon: LogOut,
    },
  ]

  const handleNavigation = (href: string) => {
    if (onMenuItemClick) {
      onMenuItemClick()
    }
    router.push(href)
  }

  return (
    <div className="flex h-[100dvh] w-full md:w-64 flex-col border-r bg-background">
      {/* User profile section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.profile_image_url || ""} alt={profile?.full_name || "User"} />
            <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium truncate">{profile?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email || profile?.phone_number}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6 md:p-4">
        <nav className="grid gap-4 md:gap-3 my-2">
          {routes.map((route) =>
            isMobile ? (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start text-lg font-medium py-4 md:py-2 h-auto",
                  pathname === route.href && "bg-secondary",
                )}
                onClick={() => handleNavigation(route.href)}
              >
                <route.icon className="mr-4 h-6 w-6 md:h-5 md:w-5" />
                {route.name}
              </Button>
            ) : (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start text-sm md:text-base py-2.5 md:py-3",
                  pathname === route.href && "bg-secondary",
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {route.name}
                </Link>
              </Button>
            ),
          )}
        </nav>
      </div>
    </div>
  )
}
