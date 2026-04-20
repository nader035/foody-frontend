import {
  Check,
  LayoutDashboard,
  Heart,
  ShoppingBag,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Multi-Branch Dashboard",
    desc: "A centralized command center for restaurant managers. Monitor surplus across all branches in real-time, track donation and sale metrics, and make data-driven decisions from a single screen.",
    bullets: [
      "Real-time surplus tracking per branch",
      "Unified analytics & reporting",
      "Role-based access controls",
    ],
  },
  {
    icon: Heart,
    title: "Smart Donation Matching",
    desc: "Automatically route surplus meals to the nearest charity partner. Charities receive instant notifications and can confirm pickup with a single tap — no calls, no coordination overhead.",
    bullets: [
      "Auto-match with closest charity",
      "One-tap pickup confirmation",
      "Complete donation audit trail",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Discounted Customer Marketplace",
    desc: "What isn't donated gets listed at up to 50% off for customers. Dynamic pricing, countdown timers, and a beautiful shopping experience that drives urgency and reduces waste.",
    bullets: [
      "Dynamic pricing by expiry window",
      "Live countdown timers",
      "Mobile-optimized marketplace",
    ],
  },
  {
    icon: Settings,
    title: "Manager-Controlled Policy",
    desc: "Managers set the rules. Configure donation percentages, discount rates, auto-assignment logic, and notification preferences — all from a simple settings panel.",
    bullets: [
      "Custom donate/sell split ratios",
      "Branch-level policy overrides",
      "Automation rules engine",
    ],
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    desc: "Keep everyone in the loop. WhatsApp, SMS, and email alerts notify charities of new donations, customers of new listings, and managers of important events.",
    bullets: [
      "Multi-channel alerts",
      "Configurable quiet hours",
      "Instant charity notifications",
    ],
  },
  {
    icon: BarChart3,
    title: "Reporting & Analytics",
    desc: "Beautiful, exportable reports showing meals saved, CO2 prevented, revenue recovered, and social impact. Perfect for CSR documentation and stakeholder presentations.",
    bullets: [
      "Automated weekly/monthly reports",
      "Environmental impact metrics",
      "Export to PDF & dashboards",
    ],
  },
];

export function ProductFeatures() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-[#0E3442] mb-3"
            style={{ fontSize: "2.25rem", fontWeight: 800 }}
          >
            Complete feature set
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Every tool you need to eliminate food waste, from tracking to
            reporting.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:border-[#25A05F]/20 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25A05F]/10 flex items-center justify-center mb-4">
                <f.icon size={22} className="text-[#25A05F]" />
              </div>
              <h3 className="text-[#0E3442] mb-2" style={{ fontWeight: 700 }}>
                {f.title}
              </h3>
              <p
                className="text-gray-500 text-sm mb-4"
                style={{ lineHeight: 1.7 }}
              >
                {f.desc}
              </p>
              <ul className="space-y-2">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check size={14} className="text-[#25A05F] shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
