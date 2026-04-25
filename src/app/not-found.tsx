import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { Logo } from "@/shared/branding";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="hidden lg:flex lg:w-1/2 bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-16 w-80 h-80 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-16 right-8 w-64 h-64 bg-[#25A05F] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-[#25A05F] text-sm" style={{ fontWeight: 700 }}>
            Error 404
          </p>
          <h1
            className="text-white text-5xl leading-tight"
            style={{ fontWeight: 800 }}
          >
            This page
            <br />
            was not found.
          </h1>
          <p className="text-white/65 text-lg max-w-md">
            The link may be outdated, moved, or typed incorrectly. Let&apos;s
            get you back to a useful place.
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

          <div className="w-14 h-14 rounded-2xl bg-[#25A05F]/10 flex items-center justify-center mb-6">
            <Compass className="text-[#25A05F]" size={24} />
          </div>

          <p
            className="text-[#25A05F] text-xs mb-2"
            style={{ fontWeight: 700 }}
          >
            404 NOT FOUND
          </p>
          <h2
            className="text-[#0E3442] text-3xl mb-3"
            style={{ fontWeight: 800 }}
          >
            We can&apos;t find that page
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Try heading back to the homepage or choose your portal directly.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white rounded-xl px-4 py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              <Home size={16} />
              Go To Home
            </Link>

            <Link
              href="/auth"
              className="bg-white hover:bg-gray-50 border border-gray-200 text-[#0E3442] rounded-xl px-4 py-3 text-sm inline-flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 700 }}
            >
              <ArrowLeft size={16} />
              Choose Role
            </Link>
          </div>

          <div className="mt-7 pt-6 border-t border-gray-100">
            <p className="text-gray-400 text-xs">Popular destinations</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { href: "/customer", label: "Customer" },
                { href: "/manager", label: "Manager" },
                { href: "/charity", label: "Charity" },
                { href: "/staff", label: "Staff" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-[#25A05F]/40 hover:text-[#155433] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
