"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
    </div>
  );
}
