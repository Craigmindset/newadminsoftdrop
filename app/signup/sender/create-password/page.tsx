"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      // Ensure consistent phone number formatting
      const formattedPhone = phone.startsWith("+234")
        ? phone
        : `+234${phone.substring(1)}`;

      const { data, error: authError } = await supabase.auth.signUp({
        phone: formattedPhone,
        password,
        options: {
          data: {
            phone_number: formattedPhone,
          },
        },
      });

      console.log("Signup response:", { data, error: authError });

      if (authError) throw authError;

      // Create sender profile
      const { error: profileError } = await supabase
        .from("sender_profiles")
        .upsert(
          {
            user_id: data.user?.id,
            phone_number: formattedPhone,
            created_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Account creation failed");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Create Password</h1>
        <p className="text-sm text-gray-500">
          Enter a 6-digit numeric password
        </p>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
