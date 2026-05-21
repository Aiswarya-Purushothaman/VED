"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";

export default function FeaturedEventBanner() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative px-4 md:px-6 py-14"
    >


      <div className="container-max">
        <Link
          href="/services/proposal-decoration"
          className="group block relative rounded-2xl md:rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.4)" }}
        >
          {/* ── Image ── */}
          <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
            <Image
              src="/hero-wedding-mandap.png"
              alt="Luxury wedding ceremony setup by Virtual Events & Decorations"
              fill
              className="object-cover object-center transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
            />

            {/* Dark vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(2,6,8,0.85) 0%, rgba(2,6,8,0.40) 50%, rgba(2,6,8,0.2) 100%)",
              }}
            />

            {/* Bottom gradient for mobile legibility */}
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background:
                  "linear-gradient(to top, rgba(2,6,8,0.90) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* ── Content overlay ── */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center pb-10 md:pb-0 px-7 md:px-14 lg:px-20">
            {/* Eyebrow */}
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-px rounded-full" style={{ background: TUSCAN }} />
              <span
                className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.4em] uppercase"
                style={{ color: `${TUSCAN}CC` }}
              >
                Wedding Ceremonies
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-cormorant font-semibold leading-[1.05] mb-4 text-white"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 4rem)", maxWidth: "14ch" }}
            >
              The Perfect{" "}
              <em
                className="not-italic"
                style={{
                  background: `linear-gradient(135deg, ${TUSCAN}, ${BUTTER})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Proposal
              </em>
              {" "}Starts Here
            </motion.h2>

            {/* Desc */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-dm text-sm md:text-base leading-relaxed mb-7 max-w-sm md:max-w-lg"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              From grand beach mandaps to intimate traditional rituals —
              we craft the perfect setting for your sacred union.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span
                className="inline-flex items-center gap-3 px-8 py-3.5 font-cinzel text-[10px] tracking-[0.35em] uppercase font-medium transition-all duration-300 group-hover:gap-5"
                style={{ background: TUSCAN, color: "#020608" }}
              >
                Explore Ceremonies
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </motion.div>
          </div>

          {/* Right-side floating badge — desktop only */}
          <div
            className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-1 px-5 py-4 rounded-2xl"
            style={{
              background: "rgba(2,6,8,0.55)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${TUSCAN}30`,
            }}
          >
            <span
              className="font-cormorant font-light leading-none text-white"
              style={{ fontSize: "2.5rem" }}
            >
              100<span className="text-xl">+</span>
            </span>
            <span
              className="font-cinzel text-[8px] tracking-[0.3em] uppercase text-center"
              style={{ color: `${TUSCAN}CC` }}
            >
              Proposals<br />Executed
            </span>
          </div>
        </Link>
      </div>

    </section>
  );
}
