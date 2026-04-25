import type { LoginPayload, RegisterPayload, UserProfile } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api";
import { http } from "@/lib/http";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  user: UserProfile;
}

async function unwrapResponse<T>(promise: Promise<{ data: ApiEnvelope<T> }>) {
  const response = await promise;
  return response.data.data;
}

export const authApi = {
  login(data: LoginPayload) {
    return unwrapResponse<AuthResponse>(
      http.post(API_ENDPOINTS.users.login, data),
    );
  },
  register(data: RegisterPayload) {
    return unwrapResponse<AuthResponse>(
      http.post(API_ENDPOINTS.users.register, data),
    );
  },
  getCurrentUser() {
    return unwrapResponse<UserProfile>(http.get(API_ENDPOINTS.users.me));
  },
};

export type { LoginPayload, RegisterPayload, UserProfile };
