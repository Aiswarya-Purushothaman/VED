"use client";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Palette,
  BadgeDollarSign,
  Clock4,
  Star,
  Camera,
  Sparkles,
} from "lucide-react";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";
const BREEZE = "#92ADA4";

/* ── Features data ────────────────────────────────── */
const features = [
  {
    Icon: Palette,
    title: "Fully Customisable",
    desc: "Every setup is tailored to your unique vision, theme, and preferences.",
    accent: TUSCAN,
  },
  {
    Icon: BadgeDollarSign,
    title: "Affordable Packages",
    desc: "Premium quality decoration at prices that fit every budget.",
    accent: BREEZE,
  },
  {
    Icon: Clock4,
    title: "On-Time Delivery",
    desc: "We arrive on schedule and complete setup with time to spare.",
    accent: BUTTER,
  },
  {
    Icon: Star,
    title: "5-Star Rated",
    desc: "Consistently praised for excellence by 500+ satisfied clients.",
    accent: TUSCAN,
  },
  {
    Icon: Camera,
    title: "Photography Add-ons",
    desc: "Professional photography packages available to capture every moment.",
    accent: BREEZE,
  },
  {
    Icon: Sparkles,
    title: "Setup & Cleanup Included",
    desc: "We handle everything — from installation to post-event cleanup.",
    accent: BUTTER,
  },
];

export default function WhyChooseUs() {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a simplified version or just the structure to avoid hydration mismatch
    return <section className="py-16 md:py-24 px-4 md:px-6" style={{ background: "linear-gradient(180deg, #EDFAFA 0%, #E0F5F5 100%)" }} />;
  }


  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 px-4 md:px-6"
      style={{ background: "linear-gradient(180deg, #EDFAFA 0%, #E0F5F5 100%)" }}
    >
      {/* ── Ambient glows ── */}
      <div
        className="absolute -top-20 -left-20 w-56 h-56 md:w-72 md:h-72 rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: TUSCAN }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-56 h-56 md:w-72 md:h-72 rounded-full blur-[100px] opacity-15 pointer-events-none"
        style={{ background: BREEZE }}
      />

      {/* ── Gradient rules ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${TUSCAN}50, transparent)` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${BREEZE}50, transparent)` }}
      />

      <div className="container-max relative z-10">

        {/* ── Section header ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <span
            className="inline-flex items-center gap-3 font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: SADDLE }}
          >
            <span className="w-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${TUSCAN})` }} />
            Why Us
            <span className="w-8 h-px" style={{ background: `linear-gradient(to left, transparent, ${TUSCAN})` }} />
          </span>
          <h2
            className="font-playfair font-bold leading-tight text-light"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Why Choose{" "}
            <em className="font-cormorant not-italic" style={{ color: TUSCAN }}>
              Virtual Events
            </em>
          </h2>
          <p
            className="font-dm text-sm md:text-base mt-3 max-w-md mx-auto"
            style={{ color: `${SADDLE}90` }}
          >
            Premium décor, reliable service, and unforgettable results — every time.
          </p>
        </motion.div>

        {/* ════════════════════════════════════
            MOBILE: 2-col compact cards
        ════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center rounded-2xl p-4 overflow-hidden"
              style={{
                background: "rgba(237,250,250,0.8)",
                border: `1px solid ${f.accent}25`,
                boxShadow: `0 2px 16px ${f.accent}12`,
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: `${f.accent}15`,
                  border: `1.5px solid ${f.accent}35`,
                }}
              >
                <f.Icon size={20} strokeWidth={1.6} style={{ color: f.accent }} />
              </div>

              <h3
                className="font-cormorant text-sm font-semibold leading-snug mb-1"
                style={{ color: "#0A1F1E" }}
              >
                {f.title}
              </h3>
              <p
                className="font-dm text-[11px] leading-relaxed line-clamp-3"
                style={{ color: `${SADDLE}90` }}
              >
                {f.desc}
              </p>

              {/* Corner dot */}
              <span
                className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-40"
                style={{ background: f.accent }}
              />
            </motion.div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            TABLET & DESKTOP: Two-column editorial split
            LEFT:  sticky brand statement + pull-quote
            RIGHT: vertical feature list with hairline separators
        ════════════════════════════════════════════════════ */}
        <div className="hidden sm:grid sm:grid-cols-[2fr_3fr] lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT: brand anchor panel ── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="sm:sticky sm:top-28 flex flex-col gap-8"
          >
            {/* Pull-quote */}
            <div>
              <div
                className="font-cormorant font-light leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#0A1F1E" }}
              >
                Built on
                <br />
                <em className="not-italic" style={{ color: TUSCAN }}>trust,</em>
                <br />
                delivered
                <br />
                with <em className="not-italic" style={{ color: BREEZE }}>care.</em>
              </div>
              <p
                className="font-dm text-sm leading-relaxed"
                style={{ color: `${SADDLE}90`, maxWidth: "28ch" }}
              >
                From the first call to the final clean-up, every detail is handled with precision and heart.
              </p>
            </div>

            {/* Featured stat */}
            <div
              className="inline-flex flex-col gap-1 px-5 py-4 rounded-2xl self-start"
              style={{
                background: `${TUSCAN}12`,
                border: `1px solid ${TUSCAN}28`,
              }}
            >
              <span
                className="font-cormorant font-light leading-none"
                style={{ fontSize: "3rem", color: TUSCAN }}
              >
                500<span className="text-2xl">+</span>
              </span>
              <span
                className="font-cinzel text-[9px] tracking-[0.35em] uppercase"
                style={{ color: SADDLE }}
              >
                Happy Clients
              </span>
            </div>

            {/* Accent line */}
            <div
              className="w-12 h-px"
              style={{ background: `linear-gradient(to right, ${TUSCAN}, transparent)` }}
            />
          </motion.div>

          {/* ── RIGHT: vertical feature list ── */}
          <div className="flex flex-col">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Hairline separator */}
                {i > 0 && (
                  <div
                    className="h-px my-0"
                    style={{ background: `linear-gradient(to right, ${f.accent}35, transparent)` }}
                  />
                )}

                <div className="group flex items-start gap-5 py-7 relative">
                  {/* Left accent thread */}
                  <div
                    className="absolute left-0 top-6 bottom-6 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"
                    style={{ background: `linear-gradient(to bottom, transparent, ${f.accent}, transparent)` }}
                  />

                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${f.accent}12`,
                      border: `1px solid ${f.accent}30`,
                    }}
                  >
                    <f.Icon size={18} strokeWidth={1.5} style={{ color: f.accent }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <h3
                        className="font-cormorant font-semibold leading-tight"
                        style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", color: "#0A1F1E" }}
                      >
                        {f.title}
                      </h3>
                      <span
                        className="font-cinzel text-[8px] tracking-[0.3em] opacity-40 flex-shrink-0"
                        style={{ color: f.accent }}
                      >
                        0{i + 1}
                      </span>
                    </div>
                    <p
                      className="font-dm text-sm leading-relaxed"
                      style={{ color: `${SADDLE}90` }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
