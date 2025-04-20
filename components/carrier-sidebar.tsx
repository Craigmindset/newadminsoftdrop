"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CreditCard, DollarSign, Home, LogOut, MapPin, Search, Send, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CarrierSidebarProps {
  onMenuItemClick?: () => void
}

export function CarrierSidebar({ onMenuItemClick }: CarrierSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const routes = [
    {
      name: "Dashboard",
      href: "/carrier/dashboard",
      icon: Home,
    },
    {
      name: "Set Trip",
      href: "/carrier/dashboard/trip",
      icon: MapPin,
    },
    {
      name: "Find Senders",
      href: "/carrier/dashboard/find",
      icon: Search,
    },
    {
      name: "My Deliveries",
      href: "/carrier/dashboard/deliveries",
      icon: Send,
    },
    {
      name: "Wallet",
      href: "/carrier/dashboard/wallet",
      icon: CreditCard,
    },
    {
      name: "Escrow",
      href: "/carrier/dashboard/escrow",
      icon: DollarSign,
    },
    {
      name: "Profile",
      href: "/carrier/dashboard/profile",
      icon: User,
    },
    {
      name: "Settings",
      href: "/carrier/dashboard/settings",
      icon: Settings,
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
