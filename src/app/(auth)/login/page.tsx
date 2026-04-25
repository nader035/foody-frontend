import type { Metadata } from "next";
import { Suspense } from 'react';
import { AuthLogin } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login",
};


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLogin />
    </Suspense>
  );
}
