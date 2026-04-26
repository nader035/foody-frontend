import type { UserRole } from "@/features/auth/types";

export const roleHome: Record<UserRole, string> = {
  customer: "/customer",
  manager: "/manager",
  staff: "/staff",
  charity: "/charity",
};

export const protectedRolePrefixes: Array<{ prefix: string; role: UserRole }> =
  [
    { prefix: "/customer", role: "customer" },
    { prefix: "/manager", role: "manager" },
    { prefix: "/staff", role: "staff" },
    { prefix: "/charity", role: "charity" },
  ];

export const guestOnlyPrefixes = [
  "/auth",
  "/login",
  "/register",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function isPathMatch(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getRequiredRole(pathname: string) {
  return protectedRolePrefixes.find((entry) =>
    isPathMatch(pathname, entry.prefix),
  )?.role;
}

export function isGuestOnlyRoute(pathname: string) {
  return guestOnlyPrefixes.some((prefix) => isPathMatch(pathname, prefix));
}
