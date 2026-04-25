import {
  Bell,
  Clock,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";
import { Logo } from "@/shared/branding";
import type { Tab } from "./types";

interface PortalSidebarProps {
  activeTab: Tab;
  pendingDonationsCount: number;
  unreadCount: number;
  organizationName?: string;
  onTabChange: (tab: Tab) => void;
  onHome: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
  {
    id: "donations" as Tab,
    label: "Donations",
    icon: Package,
    getBadge: (pendingDonationsCount: number) => pendingDonationsCount,
  },
  { id: "history" as Tab, label: "History", icon: Clock },
  {
    id: "notifications" as Tab,
    label: "Notifications",
    icon: Bell,
    getBadge: (_pendingDonationsCount: number, unreadCount: number) =>
      unreadCount,
  },
  { id: "profile" as Tab, label: "Profile", icon: User },
  { id: "settings" as Tab, label: "Settings", icon: Settings },
];

export function PortalSidebar({
  activeTab,
  pendingDonationsCount,
  unreadCount,
  organizationName,
  onTabChange,
  onHome,
  onLogout,
}: PortalSidebarProps) {
  return (
    <aside className="w-60 bg-white border-r border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="pb-5 cursor-pointer" onClick={onHome}>
        <Logo size="sm" />
      </div>

      <div className="rounded-xl bg-pink-50 p-3 mb-4">
        <p className="text-pink-500 text-xs" style={{ fontWeight: 600 }}>
          Charity Partner
        </p>
        <p className="text-[#0E3442] text-sm" style={{ fontWeight: 700 }}>
          {organizationName || "Charity"}
        </p>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => {
          const badge =
            item.getBadge?.(pendingDonationsCount, unreadCount) ?? 0;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${
                activeTab === item.id
                  ? "bg-[#25A05F]/10 text-[#25A05F]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              style={{ fontWeight: activeTab === item.id ? 600 : 500 }}
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              {badge ? (
                <span
                  className="h-5 min-w-5 rounded-full bg-[#25A05F] text-white text-[10px] flex items-center justify-center px-1"
                  style={{ fontWeight: 700 }}
                >
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
