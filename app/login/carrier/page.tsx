"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function CarrierLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || phone.length !== 11) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }

    if (!password || password.length !== 6) {
      setError("Password must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+234${phone.substring(1)}`;

      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          phone: formattedPhone,
          password,
        }
      );

      if (authError) {
        if (authError.message.includes("Invalid")) {
          throw new Error("The phone number or password is incorrect");
        }
        throw authError;
      }

      // Verify user is a carrier
      if (data.user?.user_metadata?.user_type !== "carrier") {
        await supabase.auth.signOut();
        throw new Error("Only carriers can access this portal");
      }

      router.push("/carrier/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Carrier Login</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your phone number and password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0812 345 6789"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="h-12 pl-10 text-lg"
                maxLength={11}
                required
              />
            </div>

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
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup/carrier"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign up as carrier
          </Link>
        </div>
      </div>
    </div>
  );
}
