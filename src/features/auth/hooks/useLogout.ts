import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/features/auth/services/auth.api";
import { clearAuthSession } from "@/platform/auth/session.client";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Ignore errors during logout to ensure local session is cleared
      }
    },
    onSettled: () => {
      clearAuthSession();
      queryClient.clear();
      router.push("/auth");
    },
  });
}
