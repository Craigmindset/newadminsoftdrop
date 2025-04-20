"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  CreditCard,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShieldAlert,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isActive: boolean
}

function NavItem({ href, icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive ? "bg-black text-white" : "text-gray-500 hover:text-black hover:bg-gray-100",
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    router.push("/admin")
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softDrop-Logo2-jP4n5ZtyHNVWxET8XMOadJAtNMzpD0.png"
                alt="SoftDrop Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>Super Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-100 lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto py-4 px-3 space-y-6">
            <nav className="space-y-1">
              <NavItem
                href="/admin/dashboard"
                icon={<Home className="h-5 w-5" />}
                title="Dashboard"
                isActive={pathname === "/admin/dashboard"}
              />
              <NavItem
                href="/admin/dashboard/users"
                icon={<Users className="h-5 w-5" />}
                title="User Management"
                isActive={pathname === "/admin/dashboard/users"}
              />
              <NavItem
                href="/admin/dashboard/transactions"
                icon={<CreditCard className="h-5 w-5" />}
                title="Transactions"
                isActive={
                  pathname === "/admin/dashboard/transactions" || pathname.startsWith("/admin/dashboard/transactions/")
                }
              />
              <NavItem
                href="/admin/dashboard/disputes"
                icon={<ShieldAlert className="h-5 w-5" />}
                title="Dispute Management"
                isActive={pathname === "/admin/dashboard/disputes"}
              />
              <NavItem
                href="/admin/dashboard/notifications"
                icon={<Bell className="h-5 w-5" />}
                title="Notifications"
                isActive={pathname === "/admin/dashboard/notifications"}
              />
              <NavItem
                href="/admin/dashboard/analytics"
                icon={<BarChart3 className="h-5 w-5" />}
                title="Analytics"
                isActive={pathname === "/admin/dashboard/analytics"}
              />
              <NavItem
                href="/admin/dashboard/roles"
                icon={<Users className="h-5 w-5" />}
                title="Admin Roles"
                isActive={pathname === "/admin/dashboard/roles"}
              />
              <NavItem
                href="/admin/dashboard/support"
                icon={<MessageSquare className="h-5 w-5" />}
                title="Support"
                isActive={pathname === "/admin/dashboard/support"}
              />
            </nav>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <nav className="space-y-1">
                <NavItem
                  href="/admin/dashboard/settings"
                  icon={<Settings className="h-5 w-5" />}
                  title="Settings"
                  isActive={pathname === "/admin/dashboard/settings"}
                />
                <NavItem
                  href="/admin/dashboard/help"
                  icon={<HelpCircle className="h-5 w-5" />}
                  title="Help & Documentation"
                  isActive={pathname === "/admin/dashboard/help"}
                />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
