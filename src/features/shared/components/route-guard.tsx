"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/lib/api-client";
import {
  getRequiredRole,
  isGuestOnlyRoute,
  roleHome,
} from "@/lib/route-access";

export function RouteGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const token = getAuthToken();
    const user = getAuthUser();
    const requiredRole = getRequiredRole(pathname);

    if (requiredRole) {
      if (!token) {
        router.replace("/auth");
        return;
      }

      if (user?.role && user.role !== requiredRole) {
        router.replace(roleHome[user.role]);
      }

      return;
    }

    if (isGuestOnlyRoute(pathname) && token && user?.role) {
      router.replace(roleHome[user.role]);
    }
  }, [pathname, router]);

  return null;
}

