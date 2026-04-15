"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type RecoveryState =
  | { status: "checking" }
  | { status: "invalid"; message: string }
  | { status: "ready" };

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    status: "checking",
  });

  useEffect(() => {
    let mounted = true;

    async function establishRecovery() {
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, ""),
      );
      const queryParams = new URLSearchParams(window.location.search);

      const accessToken =
        hashParams.get("access_token") || queryParams.get("access_token");
      const refreshToken =
        hashParams.get("refresh_token") || queryParams.get("refresh_token");
      const code = queryParams.get("code") || hashParams.get("code");
      const tokenHash =
        queryParams.get("token_hash") || hashParams.get("token_hash");
      const type = queryParams.get("type") || hashParams.get("type");
      const errorDescription =
        queryParams.get("error_description") ||
        hashParams.get("error_description") ||
        queryParams.get("error") ||
        hashParams.get("error");

      if (errorDescription) {
        setRecoveryState({ status: "invalid", message: errorDescription });
        return;
      }

      try {
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw sessionError;
          }
        } else if (code) {
          const { error: codeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (codeError) {
            throw codeError;
          }
        } else if (tokenHash && type === "recovery") {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (verifyError) {
            throw verifyError;
          }
        } else {
          setRecoveryState({
            status: "invalid",
            message:
              "No recovery token found. Request a new link and open the newest email.",
          });
          return;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !data.session) {
          throw sessionError || new Error("No recovery session");
        }

        if (!mounted) {
          return;
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        setRecoveryState({ status: "ready" });
      } catch (err) {
        if (!mounted) {
          return;
        }

        setRecoveryState({
          status: "invalid",
          message:
            err instanceof Error
              ? err.message
              : "Unable to validate recovery link. Request a new email.",
        });
      }
    }

    establishRecovery();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message || "Unable to update password");
      setSubmitting(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting to admin login...");
    setSubmitting(false);
    window.setTimeout(() => {
      router.push("/admin");
    }, 1200);
  }

  if (recoveryState.status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center text-sm text-gray-600">
          Validating recovery link...
        </div>
      </div>
    );
  }

  if (recoveryState.status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Invalid or expired link
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Request a new recovery email and open the latest link from your
            inbox.
          </p>
          <p className="mt-3 text-sm text-red-500">{recoveryState.message}</p>
          <Link
            href="/admin/forgot-password"
            className="mt-6 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Set New Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a new password for your admin account.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              New password
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-black"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-black"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
