"use client";

import type { UserProfile } from "@/features/auth/types";

const authCookieMaxAgeSeconds = 60 * 60 * 24 * 7;

function writeCookie(
  name: string,
  value: string,
  maxAgeSeconds = authCookieMaxAgeSeconds,
) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function saveAuthUser(user: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("foody_user", JSON.stringify(user));
    writeCookie("foody_role", user.role);
  }
}

export function saveAuthSession(user: UserProfile) {
  saveAuthUser(user);
}

export function getAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("foody_user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("foody_user");
    deleteCookie("foody_role");
  }
}
