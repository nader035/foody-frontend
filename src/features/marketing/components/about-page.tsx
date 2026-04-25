"use client";
import { useRouter } from "next/navigation";
import { MarketingNavbar } from "@/features/marketing/components/shared/marketing-navbar";
import { Logo } from "@/shared/branding";
import { ImageWithFallback } from "@/shared/media";
import {
  ArrowRight,
  Heart,
  Leaf,
  Target,
  TrendingUp,
  Globe,
  Award,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const team = [
  { name: "Nader Mohamed", role: "Co-Founder & CEO", initials: "NM" },
  { name: "Ibrahim Ashraf", role: "Co-Founder & CTO", initials: "IA" },
  { name: "Ahmed Hesham", role: "Co-Founder & COO", initials: "AH" },
  { name: "Gehad Ashour", role: "Co-Founder & CMO", initials: "GA" },
];

const marketStats = [
  { v: "120K+", l: "Restaurants in Egypt" },
  { v: "~30%", l: "Daily food waste rate" },
  { v: "8-10%", l: "Annual restaurant sector growth (CAGR)" },
];

export function AboutPage() {
  const navigate = useRouter();
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <MarketingNavbar activeLink="About us" />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 bg-[#25A05F]/10 text-[#25A05F] text-xs px-3 py-1.5 rounded-full mb-6"
              style={{ fontWeight: 600 }}
            >
              <Heart size={14} /> Our Mission
            </div>
            <h1
              className="text-[#0E3442] mb-5"
              style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.1 }}
            >
              Connecting surplus food with those who need it
            </h1>
            <p className="text-gray-500 mb-6" style={{ lineHeight: 1.8 }}>
              Foody connects customers with premium surplus meals from local
              restaurants at discounted prices. With Foody, you save money,
              enjoy fresh food, and at the same time reduce food waste while
              contributing to tangible social impact.
            </p>
            <div className="grid grid-cols-3">
              {[
                { v: "2026", l: "Founded" },
                { v: "Food & Restaurants", l: "Industry" },
                { v: "Web Platform", l: "Category" },
              ].map((s) => (
                <div key={s.l}>
                  <p
                    className="text-[#25A05F] text-lg"
                    style={{ fontWeight: 700 }}
                  >
                    {s.v}
                  </p>
                  <p className="text-gray-400 text-xs">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src="/hero.png"
              alt="Food donation"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <Target size={22} className="text-red-500" />
              </div>
              <h3
                className="text-[#0E3442] text-xl mb-3"
                style={{ fontWeight: 700 }}
              >
                The Problem
              </h3>
              <p className="text-gray-500" style={{ lineHeight: 1.8 }}>
                Every day, major restaurant chains prepare meals that exceed
                sales demand. Without a technical system to manage this surplus,
                these meals end up either wasted in trash bins or distributed
                randomly and without organization.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[#25A05F]/20 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#25A05F]/10 flex items-center justify-center mb-4">
                <Leaf size={22} className="text-[#25A05F]" />
              </div>
              <h3
                className="text-[#0E3442] text-xl mb-3"
                style={{ fontWeight: 700 }}
              >
                The Solution
              </h3>
              <p className="text-gray-500" style={{ lineHeight: 1.8 }}>
                Foody is an innovative centralized web platform connecting
                restaurant management, branch staff, charitable organizations,
                and individual customers in one integrated technical system that
                ensures surplus management efficiently and with complete ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-[#0E3442] mb-3"
              style={{ fontSize: "2rem", fontWeight: 800 }}
            >
              Market opportunity
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              An untapped opportunity with a clear path to massive growth in
              Egypt&apos;s restaurant surplus market.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {marketStats.map((s) => (
              <div
                key={s.l}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100"
              >
                <p
                  className="text-[#155433] text-3xl mb-2"
                  style={{ fontWeight: 800 }}
                >
                  {s.v}
                </p>
                <p className="text-gray-500 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-[#0E3442] text-center mb-10"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            Why now?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Globe,
                title: "No local solutions exist",
                desc: "No single local platform addresses the waste problem comprehensively until now.",
              },
              {
                icon: TrendingUp,
                title: "Digital transformation boom",
                desc: "Mobile apps and e-payment have become essential parts of Egyptian life.",
              },
              {
                icon: Leaf,
                title: "Growing ESG pressure",
                desc: "Brands are now urgently needing to document their social and environmental impact formally.",
              },
              {
                icon: Award,
                title: "Real customer readiness",
                desc: "Starting with a live pilot with major restaurant chains from day one.",
              },
            ].map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#25A05F]/10 flex items-center justify-center shrink-0">
                  <w.icon size={20} className="text-[#25A05F]" />
                </div>
                <div>
                  <h4
                    className="text-[#0E3442] mb-1"
                    style={{ fontWeight: 700 }}
                  >
                    {w.title}
                  </h4>
                  <p
                    className="text-gray-500 text-sm"
                    style={{ lineHeight: 1.7 }}
                  >
                    {w.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-[#0E3442] mb-3"
              style={{ fontSize: "2rem", fontWeight: 800 }}
            >
              The makers of Foody
            </h2>
            <p className="text-gray-400">
              A passionate team committed to eliminating food waste in Egypt.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl bg-[#155433] flex items-center justify-center mx-auto mb-4 text-white text-xl"
                  style={{ fontWeight: 700 }}
                >
                  {t.initials}
                </div>
                <h4 className="text-[#0E3442]" style={{ fontWeight: 700 }}>
                  {t.name}
                </h4>
                <p className="text-gray-400 text-sm">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#155433] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-white mb-3"
            style={{ fontSize: "2rem", fontWeight: 800 }}
          >
            Get in touch
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Interested in partnering with Foody? We&apos;d love to hear from
            you.
          </p>
          <div className="flex justify-center gap-6 flex-wrap mb-8">
            {[
              { icon: Mail, v: "xxibrahimashrafxx@gmail.com" },
              { icon: Phone, v: "+201280669592" },
              { icon: MapPin, v: "Alexandria & Cairo, Egypt" },
            ].map((c) => (
              <div
                key={c.v}
                className="flex items-center gap-2 text-white/70 text-sm"
              >
                <c.icon size={16} className="text-[#25A05F]" /> {c.v}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate.push("/signup")}
            className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-8 py-3.5 rounded-xl flex items-center gap-2 mx-auto transition-colors"
            style={{ fontWeight: 700 }}
          >
            Start your journey <ArrowRight size={18} />
          </button>
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
