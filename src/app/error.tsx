"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="hidden lg:flex lg:w-1/2 bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-24 -left-20 w-80 h-80 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-10 w-64 h-64 bg-[#25A05F] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-[#25A05F] text-sm" style={{ fontWeight: 700 }}>
            Application Error
          </p>
          <h1
            className="text-white text-5xl leading-tight"
            style={{ fontWeight: 800 }}
          >
            Something went
            <br />
            wrong here.
          </h1>
          <p className="text-white/65 text-lg max-w-md">
            We couldn&apos;t load this view right now. You can retry immediately
            or return to a stable page.
          </p>
        </div>

        <p className="relative z-10 text-white/30 text-sm">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-10">
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-600" size={24} />
          </div>

          <p className="text-red-600 text-xs mb-2" style={{ fontWeight: 700 }}>
            UNEXPECTED ERROR
          </p>
          <h2
            className="text-[#0E3442] text-3xl mb-3"
            style={{ fontWeight: 800 }}
          >
            We hit an issue on this page
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please try again. If the issue persists, go back to the homepage or
            choose your portal.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={reset}
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white rounded-xl px-4 py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              <RotateCcw size={16} />
              Try Again
            </button>

            <Link
              href="/"
              className="bg-white hover:bg-gray-50 border border-gray-200 text-[#0E3442] rounded-xl px-4 py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              <Home size={16} />
              Go To Home
            </Link>
          </div>

          <div className="mt-7 pt-6 border-t border-gray-100">
            <Link
              href="/auth"
              className="text-[#25A05F] hover:text-[#155433] text-sm inline-flex items-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              <ArrowLeft size={16} />
              Back To Role Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
