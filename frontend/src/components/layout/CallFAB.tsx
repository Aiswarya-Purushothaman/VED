"use client";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function CallFAB() {
  return (
    <motion.a
      href="tel:8884447579"
      aria-label="Call us"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.0, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg group"
    >
      {/* Multi-ring pulse */}
      <span className="fab-ring-1 bg-primary" />
      <span className="fab-ring-2 bg-primary" />

      <Phone size={24} className="text-white fill-white relative z-10" />

      {/* Sliding tooltip */}
      <motion.span
        initial={{ opacity: 0, x: 10, scale: 0.9 }}
        whileHover={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute right-16 bg-dark-card text-light text-xs font-dm px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none border border-primary/20 shadow-warm"
      >
        Call Us Now
      </motion.span>
    </motion.a>
  );
}
