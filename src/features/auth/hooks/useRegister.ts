"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/hooks/useCurrentUser";
import {
  authApi,
  type RegisterPayload,
} from "@/features/auth/services/auth.api";
import { saveAuthUser } from "@/platform/auth/session.client";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (response) => {
      saveAuthUser(response.user, response.token);
      queryClient.setQueryData(authQueryKeys.currentUser, response.user);
    },
  });
}
