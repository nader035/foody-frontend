import type { Metadata } from "next";
import { AuthForgotPassword } from '@/features/auth/components/auth-forgot-password';

export const metadata: Metadata = {
  title: "Forgot Password",
};


export default function ForgotPasswordPage() {
  return <AuthForgotPassword />;
}
