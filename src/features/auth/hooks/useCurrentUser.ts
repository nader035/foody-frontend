"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/services/auth.api";
import { getAuthRole } from "@/platform/auth/session.client";

export const authQueryKeys = {
  currentUser: ["auth", "current-user"] as const,
};

export function useCurrentUser() {
  const role = getAuthRole();

  return useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: authApi.getCurrentUser,
    enabled: !!role,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
