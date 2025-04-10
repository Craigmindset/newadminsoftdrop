"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function VerifyPhoneContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (phone) {
      setPhoneNumber(phone);
    }
  }, [searchParams]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) {
      router.push("/signup/sender/create-password");
    }
  };

  const handleResend = () => {
    setCountdown(120);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    document.getElementById("otp-0")?.focus();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={24} className="text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-2">
            Verify Phone Number
          </h1>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          Enter the 6-digit code sent to your{" "}
          <span className="font-medium">{phoneNumber}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mx-4 flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="h-14 w-12 sm:w-14 text-center text-2xl"
                required
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Resend Code
              </button>
            ) : (
              <p>
                Resend code in {Math.floor(countdown / 60)}:
                {String(countdown % 60).padStart(2, "0")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-medium"
            disabled={otp.some((d) => d === "")}
          >
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyPhone() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading verification...
        </div>
      }
    >
      <VerifyPhoneContent />
    </Suspense>
  );
}
