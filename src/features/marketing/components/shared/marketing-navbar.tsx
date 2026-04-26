"use client";

import Link from "next/link";
import { Logo } from "@/shared/branding";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ArrowRight } from "lucide-react";

type NavLabel = "Product" | "Solutions" | "Pricing" | "About us";

type MarketingNavbarProps = {
  activeLink?: NavLabel;
};

const links: Array<{ label: NavLabel; path: string }> = [
  { label: "Product", path: "/product" },
  { label: "Solutions", path: "/solutions" },
  { label: "Pricing", path: "/pricing" },
  { label: "About us", path: "/about" },
];

export function MarketingNavbar({ activeLink }: MarketingNavbarProps) {
  const { data: user, isLoading } = useCurrentUser();

  const getDashboardLink = () => {
    if (!user) return "/auth";
    switch (user.role) {
      case "customer":
        return "/customer";
      case "manager":
        return "/manager";
      case "staff":
        return "/staff";
      case "charity":
        return "/charity";
      default:
        return "/auth";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Logo size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className={`text-sm transition-colors ${
                activeLink === link.label
                  ? "text-[#25A05F]"
                  : "text-gray-500 hover:text-[#155433]"
              }`}
              style={{ fontWeight: activeLink === link.label ? 600 : 400 }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {isLoading ? (
            <div className="w-24 h-10 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <Link
              href={getDashboardLink()}
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm text-[#155433] hover:text-[#25A05F] transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/auth"
                className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
                style={{ fontWeight: 600 }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
