"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyCarrierOtp } from "@/app/actions/carrier-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CarrierOtpVerification({ phone }: { phone: string }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    try {
      setLoading(true);
      const { error } = await verifyCarrierOtp(phone, code);

      if (error) throw error;

      router.push(
        `/signup/carrier/create-password?phone=${encodeURIComponent(phone)}`
      );
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Verify Phone Number</h2>
      <p className="text-sm text-gray-500">
        Enter the 6-digit code sent to {phone}
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="h-12 w-12 text-center text-lg"
              required
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={otp.some((d) => d === "") || loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  );
}
