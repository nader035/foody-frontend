"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/hooks/useCurrentUser";
import { authApi, type LoginPayload } from "@/features/auth/services/auth.api";
import { saveAuthUser } from "@/platform/auth/session.client";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      saveAuthUser(response.user);
      queryClient.setQueryData(authQueryKeys.currentUser, response.user);
    },
  });
}
