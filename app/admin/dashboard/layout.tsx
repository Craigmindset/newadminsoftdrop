"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  ChevronLeft,
  HelpCircle,
  Home,
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

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  collapsed?: boolean;
}

type SidebarItem = {
  href: string;
  icon: React.ReactNode;
  title: string;
  permission:
    | "dashboard:view"
    | "senders:view"
    | "carriers:view"
    | "transactions:view"
    | "wallet:view"
    | "disputes:view"
    | "notifications:view"
    | "analytics:view"
    | "roles:view"
    | "settings:view";
};

function NavItem({ href, icon, title, isActive, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? title : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        collapsed && "justify-center",
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [walletVisible, setWalletVisible] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const pathname = usePathname();

  const mainNavItems: SidebarItem[] = [
    {
      href: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
      title: "Dashboard",
      permission: "dashboard:view",
    },
    {
      href: "/admin/dashboard/senders",
      icon: <Users className="h-5 w-5" />,
      title: "Senders",
      permission: "senders:view",
    },
    {
      href: "/admin/dashboard/carriers",
      icon: <Users className="h-5 w-5" />,
      title: "Carriers",
      permission: "carriers:view",
    },
    {
      href: "/admin/dashboard/transactions",
      icon: <CreditCard className="h-5 w-5" />,
      title: "Transactions",
      permission: "transactions:view",
    },
    {
      href: "/admin/dashboard/wallet",
      icon: <Wallet className="h-5 w-5" />,
      title: "Wallet",
      permission: "wallet:view",
    },
    {
      href: "/admin/dashboard/disputes",
      icon: <ShieldAlert className="h-5 w-5" />,
      title: "Dispute",
      permission: "disputes:view",
    },
    {
      href: "/admin/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      title: "Notifications",
      permission: "notifications:view",
    },
    {
      href: "/admin/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Analytics",
      permission: "analytics:view",
    },
    {
      href: "/admin/dashboard/roles",
      icon: <Users className="h-5 w-5" />,
      title: "Admin Roles",
      permission: "roles:view",
    },
  ];

  const settingsNavItem: SidebarItem = {
    href: "/admin/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    title: "Settings",
    permission: "settings:view",
  };

  const visibleMainNavItems = mainNavItems;
  const canSeeSettings = true;

  const formattedWalletBalance =
    walletBalance === null || Number.isNaN(walletBalance)
      ? "₦—"
      : `₦${Number(walletBalance).toLocaleString()}`;

  useEffect(() => {
    let active = true;
    const cacheKey = "admin:wallet:v1";

    async function loadWallet() {
      setWalletLoading(true);

      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (active && cached) {
            setWalletBalance(
              cached.wallet_balance !== undefined
                ? Number(cached.wallet_balance)
                : null,
            );
          }
        }
      } catch (error) {
        console.error("Failed to read wallet cache", error);
      }

      try {
        const response = await fetch("/api/admin/wallet");

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!active) {
          return;
        }

        setWalletBalance(
          data.wallet_balance !== undefined ? Number(data.wallet_balance) : 0,
        );

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
          console.error("Failed to write wallet cache", error);
        }
      } catch (error) {
        console.error("Failed to load wallet", error);
      } finally {
        if (active) {
          setWalletLoading(false);
        }
      }
    }

    loadWallet();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-background border-r border-border transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
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
            className="p-1 rounded-md hover:bg-muted transition-colors"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                sidebarCollapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 hide-scrollbar">
          <nav className="space-y-1">
            {visibleMainNavItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
                collapsed={sidebarCollapsed}
              />
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-border">
            <nav className="space-y-1">
              {canSeeSettings && (
                <NavItem
                  href={settingsNavItem.href}
                  icon={settingsNavItem.icon}
                  title={settingsNavItem.title}
                  isActive={pathname === settingsNavItem.href}
                  collapsed={sidebarCollapsed}
                />
              )}
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform overflow-y-auto lg:hidden hide-scrollbar",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
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
              className="p-1 rounded-md hover:bg-muted lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto py-4 px-3 space-y-6">
            <nav className="space-y-1">
              {visibleMainNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isActive={
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                  }
                />
              ))}
            </nav>

            <div className="pt-4 mt-4 border-t border-border">
              <nav className="space-y-1">
                {canSeeSettings && (
                  <NavItem
                    href={settingsNavItem.href}
                    icon={settingsNavItem.icon}
                    title={settingsNavItem.title}
                    isActive={pathname === settingsNavItem.href}
                  />
                )}
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-foreground">Hi, Admin</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet Balance */}
            <Link
              href="/admin/dashboard/wallet"
              className="hidden sm:flex items-center gap-3 px-4 py-2 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">
                  Wallet
                </span>
                <span className="text-sm font-bold text-foreground">
                  {walletVisible
                    ? walletLoading
                      ? "Loading..."
                      : formattedWalletBalance
                    : "••••••••"}
                </span>
              </div>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setWalletVisible(!walletVisible);
                }}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                title={walletVisible ? "Hide balance" : "Show balance"}
              >
                {walletVisible ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </Link>

            {/* Broadcast Button */}
            <button className="p-2.5 rounded-full hover:bg-muted transition-colors">
              <Radio className="h-5 w-5 text-foreground" />
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-full hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
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
