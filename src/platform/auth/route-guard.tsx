"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiGetMe } from "@/lib/api";
import {
  clearAuthSession,
  getAuthRole,
  getAuthUser,
  saveAuthSession,
} from "./session.client";
import { getRequiredRole, isGuestOnlyRoute, roleHome } from "./route-access";

export function RouteGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function runGuard() {
      if (!pathname) {
        return;
      }

      let user = getAuthUser();
      let role = user?.role ?? getAuthRole();
      const requiredRole = getRequiredRole(pathname);

      if (!user && role) {
        try {
          const profile = await apiGetMe();
          if (cancelled) {
            return;
          }

          saveAuthSession(profile);
          user = profile;
          role = profile.role;
        } catch {
          if (cancelled) {
            return;
          }

          clearAuthSession();
          role = null;
        }
      }

      if (requiredRole) {
        if (!role) {
          router.replace("/auth");
          return;
        }

        if (role !== requiredRole) {
          router.replace(roleHome[role]);
        }

        return;
      }

      if (isGuestOnlyRoute(pathname) && role) {
        router.replace(roleHome[role]);
      }
    }

    runGuard();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}
