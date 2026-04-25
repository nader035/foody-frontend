import type { Metadata } from "next";
import { AuthRoleSelect } from "@/features/auth";

export const metadata: Metadata = {
  title: "Choose Role",
};


export default function AuthPage() {
  return <AuthRoleSelect />;
}
