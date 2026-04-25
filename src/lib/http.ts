import axios, { AxiosError } from "axios";

interface ApiErrorDetail {
  path: string;
  message: string;
}

interface ApiErrorPayload {
  message?: string;
  errors?: ApiErrorDetail[];
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function clearClientAuthState() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("foody_user");
  document.cookie = "foody_role=; Path=/; Max-Age=0; SameSite=Lax";
}

function toHttpError(error: AxiosError<ApiErrorPayload>) {
  const details = error.response?.data?.errors;
  const detailsMessage = details?.map((entry) => entry.message).join(", ");
  const message =
    detailsMessage ||
    error.response?.data?.message ||
    error.message ||
    "Request failed";

  return new HttpError(message, error.response?.status, details);
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      clearClientAuthState();
    }

    return Promise.reject(toHttpError(error));
  },
);
