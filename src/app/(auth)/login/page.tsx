import type { Metadata } from "next";
import { AuthLogin } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <AuthLogin />;
}
