"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Leaf } from "lucide-react";
import Image from "next/image";

export function LandingHero() {
  const navigate = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#25A05F]/10 text-[#25A05F] text-xs px-3 py-1.5 rounded-full mb-6"
            style={{ fontWeight: 600 }}
          >
            <Leaf size={14} /> Reducing food waste, one meal at a time
          </motion.div>
          <h1
            className="text-[#0E3442] mb-5"
            style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.1 }}
          >
            Turn surplus food
            <br />
            into <span className="text-[#25A05F]">impact</span>
          </h1>
          <p
            className="text-gray-500 mb-8 max-w-md"
            style={{ lineHeight: 1.7 }}
          >
            Foody connects restaurants with charities and customers to ensure
            every surplus meal finds a purpose — donated to those in need or
            sold at a discount before it goes to waste.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate.push("/manager")}
              className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-7 py-3.5 rounded-xl transition-all flex items-center gap-2 hover:gap-3"
              style={{ fontWeight: 700 }}
            >
              Start free trial <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate.push("/customer")}
              className="border border-gray-200 text-[#0E3442] px-7 py-3.5 rounded-xl hover:border-[#25A05F] hover:text-[#25A05F] transition-colors flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <ShoppingBag size={16} /> Browse meals
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/hero.png"
              alt="Foody Dashboard Preview"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 600px"
            />
          </div>
          <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#25A05F]/10 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-[#25A05F]" />
              </div>
              <div>
                <p
                  className="text-[#0E3442] text-sm"
                  style={{ fontWeight: 700 }}
                >
                  +48 donated
                </p>
                <p className="text-gray-400 text-[10px]">Today&apos;s impact</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#25A05F]/10 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-[#25A05F]" />
              </div>
              <div>
                <p
                  className="text-[#0E3442] text-sm"
                  style={{ fontWeight: 700 }}
                >
                  -82% waste
                </p>
                <p className="text-gray-400 text-[10px]">vs. last month</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
