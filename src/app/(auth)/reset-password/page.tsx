import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthResetPassword } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password",
};


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthResetPassword />
    </Suspense>
  );
}

