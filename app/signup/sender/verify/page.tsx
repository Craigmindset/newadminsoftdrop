"use client";
import { Suspense } from "react";
import VerifySenderOTPForm from "./verify-sender-otp-form";

export default function VerifySenderOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifySenderOTPForm />
    </Suspense>
  );
}
