"use client";
import { Suspense } from "react";
import VerifyCarrierOTPForm from "./verify-carrier-otp-form";

export default function VerifyCarrierOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCarrierOTPForm />
    </Suspense>
  );
}
