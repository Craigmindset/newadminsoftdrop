"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  ChevronLeft,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Radio,
  Settings,
  ShieldAlert,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthProvider } from "@/contexts/AuthContext";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  collapsed?: boolean;
}

function NavItem({ href, icon, title, isActive, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-black text-white"
          : "text-gray-500 hover:text-black hover:bg-gray-100",
        collapsed && "justify-center"
      )}
    >
      {icon}
      {!collapsed && <span>{title}</span>}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authProvider = useAuthProvider()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [walletVisible, setWalletVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authProvider?.logout()
  };

  useEffect(()=>{
    if(authProvider?.isLoggedIn === false){
      router.push("/admin")
    }
  }, [authProvider?.isLoggedIn])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!sidebarCollapsed && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softDrop-Logo2-jP4n5ZtyHNVWxET8XMOadJAtNMzpD0.png"
                alt="SoftDrop Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>Super Admin</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/admin/dashboard">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softDrop-Logo2-jP4n5ZtyHNVWxET8XMOadJAtNMzpD0.png"
                alt="SoftDrop Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 hide-scrollbar">
          <nav className="space-y-1">
            <NavItem
              href="/admin/dashboard"
              icon={<Home className="h-5 w-5" />}
              title="Dashboard"
              isActive={pathname === "/admin/dashboard"}
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/senders"
              icon={<Users className="h-5 w-5" />}
              title="Senders"
              isActive={
                pathname === "/admin/dashboard/senders" ||
                pathname.startsWith("/admin/dashboard/senders/")
              }
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/carriers"
              icon={<Users className="h-5 w-5" />}
              title="Carriers"
              isActive={
                pathname === "/admin/dashboard/carriers" ||
                pathname.startsWith("/admin/dashboard/carriers/")
              }
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/transactions"
              icon={<CreditCard className="h-5 w-5" />}
              title="Transactions"
              isActive={
                pathname === "/admin/dashboard/transactions" ||
                pathname.startsWith("/admin/dashboard/transactions/")
              }
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/disputes"
              icon={<ShieldAlert className="h-5 w-5" />}
              title="Dispute"
              isActive={pathname === "/admin/dashboard/disputes"}
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/notifications"
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              isActive={pathname === "/admin/dashboard/notifications"}
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              title="Analytics"
              isActive={pathname === "/admin/dashboard/analytics"}
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/roles"
              icon={<Users className="h-5 w-5" />}
              title="Admin Roles"
              isActive={pathname === "/admin/dashboard/roles"}
              collapsed={sidebarCollapsed}
            />
            <NavItem
              href="/admin/dashboard/support"
              icon={<MessageSquare className="h-5 w-5" />}
              title="Support"
              isActive={pathname === "/admin/dashboard/support"}
              collapsed={sidebarCollapsed}
            />
          </nav>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <nav className="space-y-1">
              <NavItem
                href="/admin/dashboard/settings"
                icon={<Settings className="h-5 w-5" />}
                title="Settings"
                isActive={pathname === "/admin/dashboard/settings"}
                collapsed={sidebarCollapsed}
              />

              <button
                onClick={handleLogout}
                title={sidebarCollapsed ? "Logout" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-100 w-full text-left transition-all",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <LogOut className="h-5 w-5" />
                {!sidebarCollapsed && <span>Logout</span>}
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform overflow-y-auto lg:hidden hide-scrollbar",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/softDrop-Logo2-jP4n5ZtyHNVWxET8XMOadJAtNMzpD0.png"
                alt="SoftDrop Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>Super Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            >
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
                href="/admin/dashboard/senders"
                icon={<Users className="h-5 w-5" />}
                title="Senders"
                isActive={
                  pathname === "/admin/dashboard/senders" ||
                  pathname.startsWith("/admin/dashboard/senders/")
                }
              />
              <NavItem
                href="/admin/dashboard/carriers"
                icon={<Users className="h-5 w-5" />}
                title="Carriers"
                isActive={
                  pathname === "/admin/dashboard/carriers" ||
                  pathname.startsWith("/admin/dashboard/carriers/")
                }
              />
              <NavItem
                href="/admin/dashboard/transactions"
                icon={<CreditCard className="h-5 w-5" />}
                title="Transactions"
                isActive={
                  pathname === "/admin/dashboard/transactions" ||
                  pathname.startsWith("/admin/dashboard/transactions/")
                }
              />
              <NavItem
                href="/admin/dashboard/disputes"
                icon={<ShieldAlert className="h-5 w-5" />}
                title="Dispute"
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
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-gray-800">Hi, Admin</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Balance */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">
                  Wallet
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {walletVisible ? "₦1,250,000" : "••••••••"}
                </span>
              </div>
              <button
                onClick={() => setWalletVisible(!walletVisible)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                title={walletVisible ? "Hide balance" : "Show balance"}
              >
                {walletVisible ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            {/* Broadcast Button */}
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
              <Radio className="h-5 w-5 text-gray-700" />
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile */}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
