import { GitBranch, Heart, LayoutDashboard, ShoppingBag } from "lucide-react";

const roles = [
  {
    icon: LayoutDashboard,
    title: "Restaurant Manager",
    desc: "Full dashboard with analytics, branch management, distribution settings, and team access controls.",
  },
  {
    icon: GitBranch,
    title: "Branch Staff",
    desc: "Quick surplus logging interface designed for speed. Log meals in seconds, right from the kitchen.",
  },
  {
    icon: Heart,
    title: "Charity Partner",
    desc: "Real-time donation alerts with one-tap pickup confirmation and complete donation history.",
  },
  {
    icon: ShoppingBag,
    title: "Customer",
    desc: "Browse and reserve discounted surplus meals from nearby restaurants at up to 50% off.",
  },
];

export function ProductRoles() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-[#0E3442] mb-3"
            style={{ fontSize: "2.25rem", fontWeight: 800 }}
          >
            Four portals, one mission
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Purpose-built experiences for every stakeholder in the food surplus
            chain.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg hover:border-[#25A05F]/20 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#25A05F]/10 flex items-center justify-center mx-auto mb-4">
                <r.icon size={24} className="text-[#25A05F]" />
              </div>
              <h3 className="text-[#0E3442] mb-2" style={{ fontWeight: 700 }}>
                {r.title}
              </h3>
              <p className="text-gray-500 text-sm" style={{ lineHeight: 1.7 }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
