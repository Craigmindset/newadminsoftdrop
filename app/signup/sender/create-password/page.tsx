"use client";
import { Suspense } from "react";
import CreatePasswordForm from "./create-password-form";

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePasswordForm />
    </Suspense>
  );
}
