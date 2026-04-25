"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthUser } from "./session.client";
import { getRequiredRole, isGuestOnlyRoute, roleHome } from "./route-access";

export function RouteGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const user = getAuthUser();
    const hasSession = Boolean(user);
    const requiredRole = getRequiredRole(pathname);

    if (requiredRole) {
      if (!hasSession) {
        router.replace("/auth");
        return;
      }

      if (user?.role && user.role !== requiredRole) {
        router.replace(roleHome[user.role]);
      }

      return;
    }

    if (isGuestOnlyRoute(pathname) && hasSession && user?.role) {
      router.replace(roleHome[user.role]);
    }
  }, [pathname, router]);

  return null;
}
