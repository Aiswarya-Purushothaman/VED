"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { buildWhatsAppURL } from "@/lib/whatsapp";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";
const BREEZE = "#92ADA4";
const ACCENTS = [TUSCAN, BUTTER, BREEZE, SADDLE];

/* ── Deterministic particles (no Math.random → no hydration mismatch) ── */
const PARTICLES = [
  { id: 0,  x: "7%",  y: "18%", s: 5, delay: 0,    dur: 4.0, dx:  28 },
  { id: 1,  x: "19%", y: "62%", s: 3, delay: 0.5,  dur: 3.5, dx: -22 },
  { id: 2,  x: "33%", y: "33%", s: 6, delay: 1.0,  dur: 4.5, dx:  14 },
  { id: 3,  x: "49%", y: "74%", s: 4, delay: 0.3,  dur: 3.2, dx: -26 },
  { id: 4,  x: "64%", y: "24%", s: 5, delay: 0.8,  dur: 5.0, dx:  19 },
  { id: 5,  x: "78%", y: "56%", s: 3, delay: 1.2,  dur: 3.6, dx: -16 },
  { id: 6,  x: "88%", y: "38%", s: 5, delay: 0.6,  dur: 4.2, dx:  24 },
  { id: 7,  x: "14%", y: "82%", s: 4, delay: 1.5,  dur: 3.0, dx:  11 },
  { id: 8,  x: "41%", y: "14%", s: 6, delay: 0.2,  dur: 4.8, dx: -19 },
  { id: 9,  x: "60%", y: "71%", s: 3, delay: 0.9,  dur: 3.7, dx:  30 },
  { id: 10, x: "24%", y: "46%", s: 5, delay: 1.3,  dur: 3.3, dx: -10 },
  { id: 11, x: "72%", y: "86%", s: 4, delay: 0.4,  dur: 4.3, dx:  16 },
];

export default function CTABanner() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 px-4 md:px-6"
      style={{ background: `linear-gradient(135deg, #0A1A18 0%, #122420 60%, #0A1A18 100%)` }}
    >
      {/* ── Ambient glows ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 25% 50%, ${TUSCAN}18 0%, transparent 70%)` }}
        animate={reduced ? {} : { scale: [1, 1.12, 1], opacity: [1, 0.65, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 50% at 75% 50%, ${BREEZE}15 0%, transparent 65%)` }}
        animate={reduced ? {} : { scale: [1, 1.15, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* ── Gradient rules ── */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${TUSCAN}50, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${BREEZE}40, transparent)` }} />

      {/* ── Floating palette particles ── */}
      {!reduced && PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x, top: p.y,
            width: p.s, height: p.s,
            background: ACCENTS[p.id % ACCENTS.length],
            opacity: 0.5,
          }}
          animate={{ y: [-8, -70], x: [0, p.dx], opacity: [0.5, 0], scale: [1, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        />
      ))}

      {/* ── Decorative diamond rings ── */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 pointer-events-none rotate-45"
        style={{ border: `1px solid ${TUSCAN}08`, borderRadius: "0" }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 pointer-events-none rotate-45"
        style={{ border: `1px solid ${BREEZE}06`, borderRadius: "0" }}
      />

      {/* ── Content ── */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="container-max relative z-10 text-center"
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${TUSCAN}60)` }} />
          <span
            className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase"
            style={{ color: `${TUSCAN}CC` }}
          >
            Get Started
          </span>
          <span className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${TUSCAN}60)` }} />
        </div>

        {/* Headline */}
        <h2
          className="font-playfair font-bold text-white mb-4 leading-[1.1]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Ready to Make Your Event{" "}
          <motion.em
            className="not-italic font-cormorant"
            style={{
              background: `linear-gradient(135deg, ${TUSCAN} 0%, ${BUTTER} 40%, ${TUSCAN} 100%)`,
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={reduced ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            Magical?
          </motion.em>
        </h2>

        {/* Thin accent rule */}
        <div
          className="mx-auto w-16 h-px mb-5 rounded-full opacity-30"
          style={{ background: TUSCAN }}
        />

        {/* Sub-copy */}
        <p
          className="font-dm text-sm sm:text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Contact us today and let&apos;s create something unforgettable together.
          We respond within 2 hours!
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary — Tuscan fill */}
          <a
            href="tel:8884447579"
            className="inline-flex items-center gap-2.5 px-9 py-4 font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase font-medium transition-all duration-300 hover:opacity-90 active:scale-95 w-full sm:w-auto justify-center"
            style={{ background: TUSCAN, color: "#020608" }}
          >
            <Phone size={14} />
            Call Now
          </a>

          {/* Secondary — WhatsApp tinted */}
          <a
            href={buildWhatsAppURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-9 py-4 font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase font-medium transition-all duration-300 hover:bg-[#25D366]/20 active:scale-95 w-full sm:w-auto justify-center"
            style={{
              border: "1px solid rgba(37,211,102,0.35)",
              color: "#25D366",
            }}
          >
            <MessageCircle size={14} />
            WhatsApp Us
          </a>
        </div>

        {/* Hours note */}
        <p
          className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.35em] uppercase mt-6"
          style={{ color: `${BREEZE}60` }}
        >
          Available 9 AM – 9 PM · 7 Days a Week
        </p>
      </motion.div>
    </section>
  );
}
