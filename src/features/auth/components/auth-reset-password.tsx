"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/shared/branding";
import { apiResetPassword } from "@/features/auth/api";
import { saveAuthSession } from "@/platform/auth/session.client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function AuthResetPassword() {
  const navigate = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const roleRedirect: Record<string, string> = useMemo(
    () => ({
      customer: "/customer",
      manager: "/manager",
      staff: "/staff",
      charity: "/charity",
    }),
    [],
  );

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setErrorMessage("");

    if (!token) {
      setErrorMessage(
        "Reset token is missing. Please request a new reset link.",
      );
      return;
    }

    try {
      setLoading(true);
      const result = await apiResetPassword({
        token,
        password: values.password,
      });
      saveAuthSession(result.user, result.token);
      setSuccess(true);

      setTimeout(() => {
        navigate.push(roleRedirect[result.user.role] || "/login");
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="hidden lg:flex lg:w-1/2 bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-24 -left-12 w-72 h-72 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-8 w-64 h-64 bg-[#25A05F] rounded-full blur-3xl" />
        </div>
        <div
          className="relative z-10 cursor-pointer"
          onClick={() => navigate.push("/")}
        >
          <Logo size="lg" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2
            className="text-white text-4xl leading-tight"
            style={{ fontWeight: 700 }}
          >
            Create a new
            <br />
            secure password.
          </h2>
          <p className="text-white/60 text-lg max-w-md">
            You are one step away from getting back into your Foody account.
          </p>
        </div>
        <p className="relative z-10 text-white/30 text-sm">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div
            className="lg:hidden mb-8 cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            <Logo size="md" />
          </div>

          {!success ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-[#155433] mb-6 transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>

              <h1
                className="text-[#0E3442] text-3xl mb-2"
                style={{ fontWeight: 700 }}
              >
                Set new password
              </h1>
              <p className="text-gray-500 mb-8">
                Choose a strong password for your account
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    className="text-gray-600 text-sm block mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPass ? "text" : "password"}
                      {...register("password")}
                      placeholder="At least 8 chars, one uppercase, one number"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="text-gray-600 text-sm block mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Repeat your new password"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
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
                  disabled={loading}
                  className="w-full bg-[#25A05F] hover:bg-[#1e8a4f] disabled:opacity-60 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Reset Password <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#25A05F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-[#25A05F]" />
              </div>
              <h1
                className="text-[#0E3442] text-3xl mb-2"
                style={{ fontWeight: 700 }}
              >
                Password updated
              </h1>
              <p className="text-gray-500">Redirecting to your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
