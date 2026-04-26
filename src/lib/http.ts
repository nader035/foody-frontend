import axios, { AxiosError } from "axios";
import { clearAuthSession } from "@/platform/auth/session.client";

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

function toHttpError(error: AxiosError<ApiErrorPayload>) {
  const data = error.response?.data;
  const isObject = typeof data === "object" && data !== null;

  const details = isObject ? data.errors : undefined;
  const detailsMessage = details?.map((entry) => entry.message).join(", ");
  const message =
    detailsMessage ||
    (isObject ? data.message : undefined) ||
    error.message ||
    "Request failed";

  return new HttpError(message, error.response?.status, details);
}

const getBaseUrl = () => {
  // Use relative path to leverage Next.js rewrites (proxies)
  // This solves third-party cookie blocking issues in production.
  return "/api/v1/";
};

export const http = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(toHttpError(error));
  },
);
