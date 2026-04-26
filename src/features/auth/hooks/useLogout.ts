import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/services/auth.api";
import { clearAuthSession } from "@/platform/auth/session.client";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore errors during logout
    } finally {
      clearAuthSession();
      queryClient.clear();
      router.push("/auth");
    }
  };

  return logout;
}
