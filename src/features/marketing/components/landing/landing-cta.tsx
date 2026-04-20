"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";

const decorativeLeaves = [
  { top: "8%", left: "12%", rotation: "28deg" },
  { top: "24%", left: "68%", rotation: "142deg" },
  { top: "42%", left: "35%", rotation: "74deg" },
  { top: "57%", left: "82%", rotation: "201deg" },
  { top: "71%", left: "18%", rotation: "319deg" },
  { top: "86%", left: "58%", rotation: "255deg" },
];

export function LandingCta() {
  const navigate = useRouter();

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-[#155433] rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {decorativeLeaves.map((leaf, i) => (
              <Leaf key={i} size={60} className="absolute text-[#25A05F]" style={{ top: leaf.top, left: leaf.left, transform: `rotate(${leaf.rotation})` }} />
            ))}
          </div>
          <div className="relative">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white mb-3" style={{ fontSize: "2rem", fontWeight: 800 }}>
              Ready to eliminate food waste?
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-white/60 mb-8 max-w-md mx-auto">
              Join 320+ restaurants already making a difference. Start your free trial today ? no credit card required.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex justify-center gap-3 flex-wrap">
              <button onClick={() => navigate.push("/manager")} className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-8 py-3.5 rounded-xl transition-colors flex items-center gap-2" style={{ fontWeight: 700 }}>
                Get started free <ArrowRight size={18} />
              </button>
              <button className="border border-white/20 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors" style={{ fontWeight: 600 }}>
                Contact sales
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
