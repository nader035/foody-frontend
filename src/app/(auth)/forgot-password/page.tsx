import type { Metadata } from "next";
import { AuthForgotPassword } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
};


export default function ForgotPasswordPage() {
  return <AuthForgotPassword />;
}
