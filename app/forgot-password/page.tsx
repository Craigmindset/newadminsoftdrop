"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!phone || phone.length !== 11) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+234${phone.substring(1)}`;

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) throw otpError;

      setSuccess(true);
      router.push(
        `/signup/sender/verify?phone=${encodeURIComponent(
          formattedPhone
        )}&reset=true`
      );
    } catch (err: any) {
      setError(
        err.message || "Failed to send verification code. Please try again."
      );
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your phone number to receive a verification code
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">
              Verification code sent successfully!
            </p>
            <p className="text-sm text-gray-500">
              Check your messages for the verification code.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-medium"
              disabled={loading}
            >
              {loading ? "Sending code..." : "Send Verification Code"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-green-600 hover:text-green-700"
              >
                Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
