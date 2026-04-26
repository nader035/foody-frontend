"use client";

import { useSyncExternalStore, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/shared/branding";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { getAuthUser } from "@/platform/auth/session.client";
import { roleHome } from "@/platform/auth/route-access";

type NavLabel = "Product" | "Solutions" | "Pricing" | "About us";

const links: Array<{ label: NavLabel; path: string }> = [
  { label: "Product", path: "/product" },
  { label: "Solutions", path: "/solutions" },
  { label: "Pricing", path: "/pricing" },
  { label: "About us", path: "/about" },
];

export function MarketingNavbar({ activeLink }: { activeLink?: NavLabel }) {
  const router = useRouter();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Use sync store for immediate UI feedback on local session
  const localUser = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => getAuthUser(),
    () => null,
  );

  // Also fetch fresh data to keep profile in sync
  const { data: apiUser } = useCurrentUser();
  const user = apiUser || localUser;

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout.mutateAsync();
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
          <Logo size="sm" />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className={`text-sm transition-colors relative py-1 ${
                activeLink === link.label
                  ? "text-[#25A05F]"
                  : "text-gray-500 hover:text-[#155433]"
              }`}
              style={{ fontWeight: activeLink === link.label ? 700 : 500 }}
            >
              {link.label}
              {activeLink === link.label && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#25A05F] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-gray-200 hover:border-[#25A05F]/30 hover:bg-gray-50 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#25A05F] to-[#155433] flex items-center justify-center text-white">
                  <UserIcon size={16} />
                </div>
                <div className="hidden sm:block text-left mr-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                    {user.role}
                  </p>
                  <p className="text-xs text-[#0E3442] font-semibold leading-none truncate max-w-[100px]">
                    {user.fullName.split(" ")[0]}
                  </p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-[#0E3442] truncate">{user.fullName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link
                    href={roleHome[user.role]}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#25A05F] transition-colors"
                  >
                    <LayoutDashboard size={18} className="text-gray-400" />
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                  >
                    <LogOut size={18} />
                    {logout.isPending ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="text-sm font-bold text-[#155433] hover:text-[#25A05F] transition-colors px-4 py-2"
              >
                Log in
              </Link>
              <Link
                href="/auth"
                className="bg-linear-to-r from-[#25A05F] to-[#155433] hover:shadow-lg hover:shadow-[#25A05F]/20 text-white text-sm px-6 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ fontWeight: 700 }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

