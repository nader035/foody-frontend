import type { Metadata } from "next";
import { AuthRoleSelect } from '@/features/auth/components/auth-role-select';

export const metadata: Metadata = {
  title: "Choose Role",
};


export default function AuthPage() {
  return <AuthRoleSelect />;
}
