"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function CreatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("Phone number not found");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^\d{6}$/.test(password)) {
      setError("Password must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const { error: authError } = await supabase.auth.updateUser({
        password,
      });

      if (authError) throw authError;

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Password creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Create a secure 6-digit password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="6-digit password"
                value={password}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setPassword(e.target.value);
                  }
                }}
                maxLength={6}
                inputMode="numeric"
                required
                className="h-12 text-lg pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm 6-digit password"
              value={confirmPassword}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setConfirmPassword(e.target.value);
                }
              }}
              maxLength={6}
              inputMode="numeric"
              required
              className="h-12 text-lg"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-medium"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
