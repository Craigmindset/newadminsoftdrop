"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function postAuthDebug(stage: string, payload: Record<string, unknown>) {
  try {
    await fetch("/api/admin/auth-debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flow: "forgot-password", stage, ...payload }),
    });
  } catch {
    // Best-effort only. Browser console remains the primary debug source.
  }
}

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    const redirectTo = `${window.location.origin}/admin/reset-password`;
    console.log("[forgot-password] request-start", {
      email: normalizedEmail,
      redirectTo,
    });
    await postAuthDebug("request-start", {
      email: normalizedEmail,
      redirectTo,
    });

    const { error: sendError } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo,
      },
    );

    if (sendError) {
      console.log("[forgot-password] request-error", sendError);
      await postAuthDebug("request-error", {
        email: normalizedEmail,
        message: sendError.message || "",
        code: (sendError as { code?: string }).code || "",
        status: (sendError as { status?: number }).status || null,
      });

      setError(sendError.message || "Unable to send recovery email.");
      setSubmitting(false);
      return;
    }

    console.log("[forgot-password] request-success");
    await postAuthDebug("request-success", { email: normalizedEmail });

    setMessage(
      "If this email exists, a password reset link has been sent. Open only the latest email.",
    );
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          Reset Admin Password
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the admin email address. Supabase will email a recovery link.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-black"
              placeholder="Admin email address"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/admin" className="hover:text-black">
            Back to admin login
          </Link>
        </div>
      </div>
    </div>
  );
}
