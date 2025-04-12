"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex flex-1">
        {/* Show sidebar on mobile when menu is open (half width), always show on desktop */}
        <div
          className={
            mobileMenuOpen
              ? "fixed inset-y-0 left-0 w-64 z-40 md:relative md:block"
              : "hidden md:block"
          }
        >
          <DashboardSidebar onMenuItemClick={() => setMobileMenuOpen(false)} />
        </div>
        {/* Semi-transparent overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
