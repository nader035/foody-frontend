"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/shared/branding";
import { Heart, ShoppingBag, User, ArrowLeft } from "lucide-react";
import { useCart } from "@/features/customer/hooks/cart-context";
import { useWishlist } from "@/features/customer/hooks/wishlist-context";
import { getAuthUser } from "@/platform/auth/session.client";

type NavKey = "marketplace" | "wishlist" | "cart" | "profile";

interface CustomerNavProps {
  active: NavKey;
  title?: string;
  backHref?: string;
}

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "marketplace", label: "Marketplace", href: "/customer" },
  { key: "wishlist", label: "Wishlist", href: "/customer/wishlist" },
  { key: "cart", label: "Cart", href: "/customer/cart" },
  { key: "profile", label: "Profile", href: "/customer/profile" },
];

function Counter({ value }: { value: number }) {
  if (value <= 0) {
    return null;
  }

  return (
    <span
      className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#25A05F] rounded-full text-[10px] flex items-center justify-center text-white"
      style={{ fontWeight: 700 }}
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function CustomerNav({ active, title, backHref }: CustomerNavProps) {
  const router = useRouter();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const isAuthenticated = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const onChange = () => onStoreChange();
      window.addEventListener("storage", onChange);
      window.addEventListener("focus", onChange);

      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("focus", onChange);
      };
    },
    () => {
      if (typeof window === "undefined") {
        return false;
      }
      return Boolean(getAuthUser());
    },
    () => false,
  );

  const rightTitle = useMemo(() => {
    if (active === "marketplace") {
      return "Find your next meal";
    }
    if (active === "wishlist") {
      return "Saved for later";
    }
    if (active === "cart") {
      return "Ready to checkout";
    }
    return "Your account";
  }, [active]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <button
              onClick={() => router.push(backHref)}
              className="text-gray-400 hover:text-[#0E3442] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <div
            className="cursor-pointer shrink-0"
            onClick={() => router.push("/")}
          >
            <Logo size="sm" />
          </div>
          <div className="hidden lg:block min-w-0">
            <p
              className="text-[#0E3442] text-sm truncate"
              style={{ fontWeight: 700 }}
            >
              {title || "Customer"}
            </p>
            <p className="text-gray-400 text-xs truncate">{rightTitle}</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-xl border border-gray-100">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                item.key === active
                  ? "bg-white text-[#25A05F] shadow-sm"
                  : "text-gray-500 hover:text-[#0E3442]"
              }`}
              style={{ fontWeight: item.key === active ? 700 : 600 }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              active === "wishlist"
                ? "bg-[#25A05F]/10 text-[#25A05F]"
                : "text-gray-500 hover:text-[#25A05F]"
            }`}
            onClick={() => router.push("/customer/wishlist")}
            aria-label="Wishlist"
          >
            <Heart
              size={16}
              fill={active === "wishlist" ? "currentColor" : "none"}
            />
            <Counter value={wishlistCount} />
          </button>

          <button
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              active === "cart"
                ? "bg-[#25A05F]/10 text-[#25A05F]"
                : "text-gray-500 hover:text-[#25A05F]"
            }`}
            onClick={() => router.push("/customer/cart")}
            aria-label="Cart"
          >
            <ShoppingBag size={16} />
            <Counter value={cartCount} />
          </button>

          <button
            onClick={() =>
              router.push(isAuthenticated ? "/customer/profile" : "/auth")
            }
            className={
              isAuthenticated
                ? "w-9 h-9 rounded-full bg-[#25A05F]/10 flex items-center justify-center text-[#25A05F] hover:bg-[#25A05F] hover:text-white transition-colors"
                : "px-4 py-2 rounded-full bg-[#25A05F] text-white hover:bg-[#1e8a4f] transition-colors text-sm"
            }
            title={isAuthenticated ? "Profile" : "Login"}
          >
            {isAuthenticated ? (
              <User size={16} />
            ) : (
              <span style={{ fontWeight: 700 }}>Login</span>
            )}
          </button>
        </div>
      </div>

      <div className="md:hidden border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                item.key === active
                  ? "bg-[#25A05F] text-white"
                  : "bg-[#F5F7FA] text-gray-600"
              }`}
              style={{ fontWeight: 700 }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
