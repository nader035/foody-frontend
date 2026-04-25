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
  localStorage.removeItem("foody_token");
  document.cookie = "foody_role=; Path=/; Max-Age=0; SameSite=Lax";
  document.cookie = "foody_token=; Path=/; Max-Age=0; SameSite=Lax";
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
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
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
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("foody_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
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
