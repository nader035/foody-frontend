"use client";
import { useRouter } from "next/navigation";
import { MarketingNavbar } from "@/features/marketing/components/shared/marketing-navbar";
import { Logo } from "@/shared/branding";
import { Check, ArrowRight, Zap, Building2, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "3,000",
    period: "/branch/month",
    desc: "Perfect for small restaurant chains just getting started with surplus management.",
    features: [
      "Up to 3 branches",
      "Basic surplus tracking",
      "Charity donation matching",
      "Customer marketplace listing",
      "Email notifications",
      "Monthly reports",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Professional",
    icon: Building2,
    price: "4,500",
    period: "/branch/month",
    desc: "For growing chains that need advanced controls and analytics.",
    features: [
      "Up to 15 branches",
      "Advanced analytics dashboard",
      "Auto split (donate/sell) engine",
      "Manager policy controls",
      "Real-time notifications (SMS + Email)",
      "Weekly & monthly reports",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "Custom",
    period: "",
    desc: "For large chains needing API integration, custom features, and dedicated support.",
    features: [
      "Unlimited branches",
      "Full API access",
      "Custom integrations (POS, ERP)",
      "Multi-role permissions",
      "Advanced analytics & custom reports",
      "White-label option",
      "Dedicated account manager",
      "SLA guarantee",
      "On-site training",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "How does the free trial work?",
    a: "You get 14 days of full access to all Professional features. No credit card required. At the end of your trial, choose the plan that works best for you.",
  },
  {
    q: "What's the commission model?",
    a: "Starting from Year 2, we charge a small 2% commission on each discounted meal sold through the platform. This only applies to customer marketplace sales, not donations.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees. The subscription price covers everything including onboarding, training materials, and initial configuration.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, bank transfers, and can arrange custom invoicing for Enterprise plans.",
  },
];

export function PricingPage() {
  const navigate = useRouter();
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <MarketingNavbar activeLink="Pricing" />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1
          className="text-[#0E3442] mb-5"
          style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.1 }}
        >
          Simple, transparent pricing
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-4">
          Monthly or annual fees per restaurant (fixed price or based on number
          of branches). Start free, upgrade when you&apos;re ready.
        </p>
        <p className="text-[#25A05F] text-sm" style={{ fontWeight: 600 }}>
          14-day free trial on all plans. No credit card required.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-7 border relative ${p.popular ? "border-[#25A05F] shadow-xl shadow-[#25A05F]/10 ring-1 ring-[#25A05F]/20" : "border-gray-100 shadow-sm"}`}
            >
              {p.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#25A05F] text-white text-xs px-4 py-1 rounded-full"
                  style={{ fontWeight: 700 }}
                >
                  Most Popular
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-[#25A05F]/10 flex items-center justify-center mb-4">
                <p.icon size={22} className="text-[#25A05F]" />
              </div>
              <h3
                className="text-[#0E3442] text-xl mb-1"
                style={{ fontWeight: 700 }}
              >
                {p.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
              <div className="mb-6">
                {p.price === "Custom" ? (
                  <span
                    className="text-[#0E3442] text-4xl"
                    style={{ fontWeight: 800 }}
                  >
                    Custom
                  </span>
                ) : (
                  <>
                    <span
                      className="text-[#0E3442] text-4xl"
                      style={{ fontWeight: 800 }}
                    >
                      {p.price}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">
                      EGP{p.period}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() =>
                  navigate.push(p.price === "Custom" ? "/about" : "/signup")
                }
                className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors mb-6 ${p.popular ? "bg-[#25A05F] hover:bg-[#1e8a4f] text-white" : "bg-gray-100 hover:bg-gray-200 text-[#0E3442]"}`}
                style={{ fontWeight: 600 }}
              >
                {p.cta} <ArrowRight size={14} />
              </button>
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-gray-600"
                  >
                    <Check size={14} className="text-[#25A05F] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue Model */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-[#0E3442] mb-3"
              style={{ fontSize: "2rem", fontWeight: 800 }}
            >
              Revenue model
            </h2>
            <p className="text-gray-400">
              Transparent revenue streams that grow with your success.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Subscription",
                desc: "Monthly or annual fees per restaurant (fixed price or based on branch count)",
                phase: "Launch",
              },
              {
                title: "Commission",
                desc: "A small 2% commission on each discounted meal sold through the platform",
                phase: "Phase 2",
              },
              {
                title: "Premium Features",
                desc: "Advanced analytics, custom branding, multi-role permissions, and API integration",
                phase: "Phase 2",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <span
                  className="inline-block bg-[#25A05F]/10 text-[#25A05F] text-xs px-3 py-1 rounded-full mb-3"
                  style={{ fontWeight: 600 }}
                >
                  {r.phase}
                </span>
                <h3 className="text-[#0E3442] mb-2" style={{ fontWeight: 700 }}>
                  {r.title}
                </h3>
                <p
                  className="text-gray-500 text-sm"
                  style={{ lineHeight: 1.7 }}
                >
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-[#0E3442] text-center mb-10"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="bg-white rounded-xl border border-gray-100 shadow-sm group"
              >
                <summary
                  className="px-6 py-4 cursor-pointer text-[#0E3442] text-sm list-none flex items-center justify-between"
                  style={{ fontWeight: 600 }}
                >
                  {f.q}
                  <span className="text-gray-300 group-open:rotate-45 transition-transform text-xl">
                    +
                  </span>
                </summary>
                <div
                  className="px-6 pb-4 text-gray-500 text-sm"
                  style={{ lineHeight: 1.7 }}
                >
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-gray-400 text-xs">
            &copy; 2026 Foody. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
