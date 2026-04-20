"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { clearAuthSession } from "@/lib/api-client";
import {
  LayoutDashboard,
  GitBranch,
  Heart,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/manager", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/manager/branches", icon: GitBranch, label: "Branches" },
  { to: "/manager/staff", icon: Users, label: "Staff" },
  { to: "/manager/charities", icon: Heart, label: "Charities" },
  { to: "/manager/reports", icon: BarChart3, label: "Reports" },
  { to: "/manager/profile", icon: User, label: "My Profile" },
  { to: "/manager/settings", icon: Settings, label: "Settings" },
];

export function ManagerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/auth");
  };

  return (
    <div
      className="flex h-screen bg-[#F5F7FA]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Sidebar */}
      <aside className="w-56 bg-white flex flex-col shrink-0 border-r border-gray-100 shadow-sm">
        <div
          className="p-5 pb-6 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Logo size="sm" />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.end
              ? pathname === item.to
              : pathname?.startsWith(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                  isActive
                    ? "bg-[#25A05F]/10 text-[#25A05F]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                style={{ fontWeight: isActive ? 600 : 500 }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top bar */}
        <header className="shrink-0 bg-white px-6 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <div className="relative max-w-xs w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search..."
              className="w-full bg-[#F5F7FA] border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 bg-[#25A05F] rounded-full text-[10px] flex items-center justify-center text-white"
                style={{ fontWeight: 700 }}
              >
                3
              </span>
            </button>
            <div
              className="w-9 h-9 rounded-full bg-[#25A05F] flex items-center justify-center text-white text-sm"
              style={{ fontWeight: 700 }}
            >
              MG
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
