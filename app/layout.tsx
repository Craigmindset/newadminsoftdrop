import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Softdropweb",
  description: "Fast and reliable logistics solutions for your delivery needs",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminProvider>
            {children}
            <Toaster />
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
