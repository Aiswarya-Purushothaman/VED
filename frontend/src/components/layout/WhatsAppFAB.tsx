"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppURL } from "@/lib/whatsapp";

export default function WhatsAppFAB() {
  return (
    <motion.a
      href={buildWhatsAppURL()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg group"
    >
      {/* Multi-ring pulse */}
      <span className="fab-ring-1 bg-[#25D366]" />
      <span className="fab-ring-2 bg-[#25D366]" />

      <MessageCircle size={26} className="text-white fill-white relative z-10" />

      {/* Sliding tooltip */}
      <motion.span
        initial={{ opacity: 0, x: 10, scale: 0.9 }}
        whileHover={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute right-16 bg-dark-card text-light text-xs font-dm px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none border border-primary/20 shadow-warm"
      >
        Chat on WhatsApp
      </motion.span>
    </motion.a>
  );
}
