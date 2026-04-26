"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Eye,
  EyeOff,
  Heart,
  LayoutDashboard,
  Lock,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogin } from "@/features/auth/hooks/useLogin";
import type { UserRole } from "@/features/auth/types";
import { Logo } from "@/shared/branding";

const roleConfig: Record<
  UserRole,
  {
    label: string;
    icon: LucideIcon;
    redirect: string;
    tagline: string;
    placeholder: string;
  }
> = {
  customer: {
    label: "Customer",
    icon: ShoppingBag,
    redirect: "/customer",
    tagline: "Welcome back! Ready to grab some deals?",
    placeholder: "you@email.com",
  },
  manager: {
    label: "Restaurant Manager",
    icon: LayoutDashboard,
    redirect: "/manager",
    tagline: "Welcome back to your dashboard",
    placeholder: "you@restaurant.com",
  },
  staff: {
    label: "Branch Staff",
    icon: ClipboardList,
    redirect: "/staff",
    tagline: "Welcome back! Let's log today's surplus",
    placeholder: "you@restaurant.com",
  },
  charity: {
    label: "Charity Organization",
    icon: Heart,
    redirect: "/charity",
    tagline: "Welcome back! New donations are waiting",
    placeholder: "you@charity.org",
  },
};

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function resolveRole(rawRole: string | null): keyof typeof roleConfig {
  if (!rawRole) {
    return "customer";
  }

  return rawRole in roleConfig
    ? (rawRole as keyof typeof roleConfig)
    : "customer";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const role = resolveRole(searchParams.get("role"));
  const config = roleConfig[role] || roleConfig.customer;
  const RoleIcon = config.icon;
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const errorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : "";

  const onSubmit = async (values: LoginFormValues) => {
    loginMutation.reset();
    try {
      const response = await loginMutation.mutateAsync({
        ...values,
        role,
      });
      router.push(roleConfig[response.user.role]?.redirect || config.redirect);
    } catch {
      return;
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="hidden lg:flex lg:w-1/2 bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-80 h-80 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-[#25A05F] rounded-full blur-3xl" />
        </div>
        <div
          className="relative z-10 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Logo size="lg" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2
            className="text-white text-4xl leading-tight"
            style={{ fontWeight: 700 }}
          >
            Reduce food waste.
            <br />
            Feed communities.
          </h2>
          <p className="text-white/60 text-lg max-w-md">
            Join hundreds of restaurants using Foody to transform surplus food
            into meaningful impact.
          </p>
          <div className="flex gap-8 pt-4">
            {[
              { v: "98.5%", l: "Waste reduced" },
              { v: "45K+", l: "Meals saved" },
              { v: "320+", l: "Partners" },
            ].map((stat) => (
              <div key={stat.l}>
                <p
                  className="text-[#25A05F] text-2xl"
                  style={{ fontWeight: 700 }}
                >
                  {stat.v}
                </p>
                <p className="text-white/40 text-sm">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-white/30 text-sm">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div
            className="lg:hidden mb-8 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Logo size="md" />
          </div>

          <button
            onClick={() => router.push("/auth")}
            className="inline-flex items-center gap-1.5 text-gray-400 text-sm hover:text-[#155433] mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Change role
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#25A05F]/10 flex items-center justify-center">
              <RoleIcon size={20} className="text-[#25A05F]" />
            </div>
            <div>
              <p className="text-[#0E3442] text-sm" style={{ fontWeight: 700 }}>
                Signing in as {config.label}
              </p>
              <p className="text-gray-400 text-xs">{config.tagline}</p>
            </div>
          </div>

          <h1
            className="text-[#0E3442] text-3xl mb-2"
            style={{ fontWeight: 700 }}
          >
            Welcome back
          </h1>
          <p className="text-gray-500 mb-8">Sign in to your Foody account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                className="text-gray-600 text-sm block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder={config.placeholder}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label
                  className="text-gray-600 text-sm"
                  style={{ fontWeight: 600 }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[#25A05F] text-sm hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#25A05F] hover:bg-[#1e8a4f] disabled:opacity-60 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 600 }}
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              className="bg-white border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Google
            </button>
            <button
              className="bg-white border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Microsoft
            </button>
          </div>

          <p className="mt-8 text-center text-gray-500 text-sm">
            {role === "staff" ? (
              <>
                Don&apos;t have credentials?{" "}
                <span className="text-[#25A05F]" style={{ fontWeight: 600 }}>
                  Contact your restaurant manager
                </span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href={`/signup?role=${role}`}
                  className="text-[#25A05F] hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Sign up free
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
