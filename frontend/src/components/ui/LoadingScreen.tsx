"use client";
import { useEffect, useState } from "react";
import LogoMark from "@/components/ui/LogoMark";
import { motion, AnimatePresence } from "framer-motion";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";
const BREEZE = "#92ADA4";

/* ── Shimmer particles (CSS only, no canvas) ─────── */
function Particles() {
  const dots = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    cx: `${8 + ((i * 137.5) % 84)}%`,
    cy: `${8 + ((i * 91.3) % 84)}%`,
    r: i % 3 === 0 ? 1.5 : 1,
    delay: i * 0.15,
    accent: [TUSCAN, BUTTER, BREEZE][i % 3],
  }));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      {dots.map((d) => (
        <motion.circle
          key={d.id}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill={d.accent}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 2.5,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.5,
          }}
        />
      ))}
    </svg>
  );
}

/* ── Main Component ───────────────────────────────── */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("ved-loaded")) {
      sessionStorage.setItem("ved-loaded", "1");
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#020608" }}
        >
          {/* ── Particles ── */}
          <Particles />

          {/* ── Radial ambient glow ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${TUSCAN}15 0%, transparent 70%)`,
            }}
          />

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <LogoMark />
            </motion.div>

            {/* Brand name */}
            <div className="text-center flex flex-col items-center gap-1">
              <motion.h1
                className="font-playfair font-bold"
                style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", color: BUTTER }}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                Virtual Events
              </motion.h1>

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span
                  className="h-px w-10"
                  style={{ background: `linear-gradient(to right, transparent, ${TUSCAN}60)` }}
                />
                <span
                  className="font-cinzel text-[9px] tracking-[0.5em] uppercase"
                  style={{ color: `${SADDLE}CC` }}
                >
                  &amp; Decorations
                </span>
                <span
                  className="h-px w-10"
                  style={{ background: `linear-gradient(to left, transparent, ${TUSCAN}60)` }}
                />
              </motion.div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="rounded-full overflow-hidden"
              style={{ width: 160, height: 2, background: `${TUSCAN}15` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${SADDLE}, ${TUSCAN}, ${BUTTER})`,
                }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.0, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="font-cinzel text-[8px] tracking-[0.5em] uppercase"
              style={{ color: `${BREEZE}60` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              We Turn Moments Into Memories
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
