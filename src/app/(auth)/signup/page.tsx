import type { Metadata } from "next";
import { Suspense } from 'react';
import { AuthSignup } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign Up",
};


export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSignup />
    </Suspense>
  );
}
