import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSignup } from "@/features/auth";

export const metadata: Metadata = {
  title: "Register",
};


export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSignup />
    </Suspense>
  );
}
