"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Heart,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

const roles = [
  {
    path: "/manager",
    label: "Restaurant Manager",
    desc: "Full dashboard with analytics, branch management, and distribution settings",
    icon: LayoutDashboard,
  },
  {
    path: "/staff",
    label: "Branch Staff",
    desc: "Quick surplus logging form designed for fast kitchen use",
    icon: ClipboardList,
  },
  {
    path: "/charity",
    label: "Charity Organization",
    desc: "Real-time donation alerts with one-tap pickup confirmation",
    icon: Heart,
  },
  {
    path: "/customer",
    label: "Individual Customer",
    desc: "Browse and reserve discounted surplus meals nearby",
    icon: ShoppingBag,
  },
];

export function LandingRoles() {
  const navigate = useRouter();

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-[#0E3442] mb-3"
            style={{ fontSize: "2.25rem", fontWeight: 800 }}
          >
            Four portals,
            <br />
            one mission
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Every stakeholder gets a purpose-built experience designed for speed
            and clarity.
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {roles.map((r) => (
            <motion.button
              key={r.path}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              onClick={() => navigate.push(r.path)}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-left hover:border-[#25A05F] hover:shadow-lg hover:shadow-[#25A05F]/5 transition-all group block w-full"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25A05F]/10 flex items-center justify-center mb-4 group-hover:bg-[#25A05F] transition-colors">
                <r.icon
                  size={22}
                  className="text-[#25A05F] group-hover:text-white transition-colors"
                />
              </div>
              <h4 className="text-[#0E3442] mb-1" style={{ fontWeight: 700 }}>
                {r.label}
              </h4>
              <p className="text-gray-400 text-sm mb-4">{r.desc}</p>
              <span
                className="text-[#25A05F] text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                style={{ fontWeight: 600 }}
              >
                Open portal <ChevronRight size={16} />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
