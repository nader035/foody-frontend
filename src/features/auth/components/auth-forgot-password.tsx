"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { apiForgotPassword } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function AuthForgotPassword() {
  const navigate = useRouter();
  const [sentToEmail, setSentToEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [devToken, setDevToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setErrorMessage("");
    setDevToken("");

    try {
      setLoading(true);
      const result = await apiForgotPassword(values);
      if (result.resetToken) {
        setDevToken(result.resetToken);
      }
      setSentToEmail(values.email);
      setSent(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send reset link",
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
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 left-10 w-64 h-64 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-0 w-72 h-72 bg-[#25A05F] rounded-full blur-3xl" />
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
            Don&apos;t worry,
            <br />
            we&apos;ve got you.
          </h2>
          <p className="text-white/60 text-lg max-w-md">
            Reset your password in seconds and get back to managing your food
            surplus.
          </p>
        </div>
        <p className="relative z-10 text-white/30 text-sm">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div
            className="lg:hidden mb-8 cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            <Logo size="md" />
          </div>

          {!sent ? (
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
                Reset password
              </h1>
              <p className="text-gray-500 mb-8">
                Enter your email and we&apos;ll send you a reset link
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    className="text-gray-600 text-sm block mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@restaurant.com"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

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
                      Send Reset Link <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}
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
                Check your email
              </h1>
              <p className="text-gray-500 mb-2">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-[#0E3442] mb-8" style={{ fontWeight: 600 }}>
                {sentToEmail}
              </p>

              {devToken && (
                <div className="mb-6 rounded-xl border border-[#25A05F]/20 bg-[#25A05F]/5 px-4 py-3 text-left">
                  <p
                    className="text-xs text-[#155433] mb-1"
                    style={{ fontWeight: 700 }}
                  >
                    Development reset token
                  </p>
                  <p className="text-[11px] text-[#155433] break-all">
                    {devToken}
                  </p>
                  <button
                    onClick={() =>
                      navigate.push(`/reset-password?token=${devToken}`)
                    }
                    className="mt-3 text-xs text-[#25A05F] hover:underline"
                    style={{ fontWeight: 700 }}
                  >
                    Continue to reset password
                  </button>
                </div>
              )}

              <button
                onClick={() => setSent(false)}
                className="text-[#25A05F] text-sm hover:underline mb-4 block mx-auto"
                style={{ fontWeight: 600 }}
              >
                Didn&apos;t receive it? Resend
              </button>

              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-[#155433] transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
