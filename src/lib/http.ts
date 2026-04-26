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
  const detailsMessage = details?.map((entry: any) => entry.message).join(", ");
  const message =
    detailsMessage ||
    (isObject ? data.message : undefined) ||
    error.message ||
    "Request failed";

  return new HttpError(message, error.response?.status, details);
}

const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = envUrl || "https://foody-backend-production.up.railway.app/api/v1";
  return url.endsWith("/") ? url : `${url}/`;
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
