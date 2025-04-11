"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyCarrierOTPForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      router.push(`/signup/carrier/kyc?phone=${encodeURIComponent(phone)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Verify Phone Number
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter the 6-digit code sent to {phone}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-12 text-lg text-center"
              maxLength={6}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-medium"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Didn't receive code?{" "}
          <button
            className="font-medium text-blue-600 hover:text-blue-700"
            onClick={() =>
              router.push(
                `/signup/carrier?phone=${encodeURIComponent(phone || "")}`
              )
            }
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
