import type { UserRole } from "@/features/auth/types";

export const USER_ROLES: UserRole[] = [
  "customer",
  "manager",
  "staff",
  "charity",
];

export const roleHome: Record<UserRole, string> = {
  customer: "/customer",
  manager: "/manager",
  staff: "/staff",
  charity: "/charity",
};

export const protectedRolePrefixes: Array<{ prefix: string; role: UserRole }> =
  [
    { prefix: "/manager", role: "manager" },
    { prefix: "/staff", role: "staff" },
    { prefix: "/charity", role: "charity" },
    { prefix: "/customer/profile", role: "customer" },
    { prefix: "/customer/wishlist", role: "customer" },
    { prefix: "/customer/cart", role: "customer" },
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

export function isUserRole(
  value: string | null | undefined,
): value is UserRole {
  if (!value) {
    return false;
  }

  return USER_ROLES.includes(value as UserRole);
}
