"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthProvider } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const auth = useAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!auth) {
      setError("Auth service not available.");
      return;
    }

    setIsSubmitting(true);
    let errorMessage = "";
    const result = await auth.login({ email, password }, (message) => {
      errorMessage = message;
      setError(message);
    });

    void fetch("/api/admin/login-debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        success: Boolean(result?.success),
        error: errorMessage || result?.error || undefined,
        errorCode: result?.errorCode,
        errorStatus: result?.errorStatus,
      }),
    });

    setIsSubmitting(false);

    if (result?.success) {
      router.push("/admin/dashboard");
    } else if (!result?.success) {
      console.log("[admin login] failed", { email });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <section className="rounded-3xl bg-white p-6 text-slate-900 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.75)] sm:p-8">
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Admin Access
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-600">
                Sign in with your admin credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center sm:text-left">
              <Link
                href="/admin/forgot-password"
                className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
