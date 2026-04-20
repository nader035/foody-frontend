"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "98.5%", label: "Food waste reduction" },
  { value: "~45k", label: "Meals saved monthly" },
  { value: "320+", label: "Restaurant partners" },
  { value: "4.9?", label: "Average rating" },
];

export function LandingStats() {
  return (
    <section className="border-y border-gray-100 bg-gray-50/50 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-center"
          >
            <p className="text-[#155433] text-3xl" style={{ fontWeight: 800 }}>
              {s.value}
            </p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
