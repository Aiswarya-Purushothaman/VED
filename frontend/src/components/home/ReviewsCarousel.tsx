"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { reviews } from "@/data/reviews";
import { SADDLE, TUSCAN, BREEZE, ACCENTS } from "@/lib/theme";
import ReviewCard from "./reviews/ReviewCard";

const mobileVariants: Variants = {
  enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0, filter: "blur(6px)" }),
  center: { x: "0%", opacity: 1, filter: "blur(0px)" },
  exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, filter: "blur(6px)" }),
};

export default function ReviewsCarousel() {
  const reduced = useReducedMotion();
  const top = reviews.slice(0, 9);

  const [mIdx, setMIdx] = useState(0);
  const [mDir, setMDir] = useState(1);

  const mPrev = useCallback(() => { setMDir(-1); setMIdx((i) => (i - 1 + top.length) % top.length); }, [top.length]);
  const mNext = useCallback(() => { setMDir(1);  setMIdx((i) => (i + 1) % top.length); }, [top.length]);

  useEffect(() => {
    const id = setInterval(mNext, 4500);
    return () => clearInterval(id);
  }, [mNext]);

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24 px-4 md:px-6"
      style={{ background: "linear-gradient(180deg, #EDFAFA 0%, #E0F5F5 100%)" }}
    >
      {/* Ambient glows */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[65vw] h-48 blur-[100px] opacity-20 pointer-events-none" style={{ background: TUSCAN }} />
      <div className="absolute -bottom-20 right-0 w-64 h-64 blur-[90px] opacity-15 pointer-events-none rounded-full" style={{ background: BREEZE }} />

      {/* Rules */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${TUSCAN}50, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${BREEZE}50, transparent)` }} />

      <div className="container-max relative z-10">

        {/* Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-3 font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4" style={{ color: SADDLE }}>
            <span className="w-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${TUSCAN})` }} />
            Testimonials
            <span className="w-8 h-px" style={{ background: `linear-gradient(to left, transparent, ${TUSCAN})` }} />
          </span>
          <h2 className="font-playfair font-bold leading-tight text-light" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            What Our Happy Clients{" "}
            <em className="font-cormorant not-italic" style={{ color: TUSCAN }}>Say</em>
          </h2>
          <p className="font-dm text-sm md:text-base mt-3 max-w-md mx-auto" style={{ color: `${SADDLE}90` }}>
            Real words from real families. 500+ events and counting.
          </p>
        </motion.div>

        {/* Mobile: single-card carousel */}
        <div className="block md:hidden">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={mDir}>
              <motion.div
                key={mIdx}
                custom={mDir}
                variants={mobileVariants}
                initial={reduced ? false : "enter"}
                animate="center"
                exit={reduced ? {} : "exit"}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <ReviewCard review={top[mIdx]} accent={ACCENTS[mIdx % ACCENTS.length]} featured />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6 px-1">
            <div className="flex gap-1.5">
              {top.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setMDir(i > mIdx ? 1 : -1); setMIdx(i); }}
                  aria-label={`Review ${i + 1}`}
                  className="rounded-full transition-all duration-400"
                  style={{ width: i === mIdx ? 20 : 6, height: 6, background: i === mIdx ? TUSCAN : `${SADDLE}25` }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={mPrev} aria-label="Previous review"
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95"
                style={{ borderColor: `${SADDLE}25`, color: SADDLE }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={mNext} aria-label="Next review"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                style={{ background: TUSCAN, color: "#020608" }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: split layout */}
        <div className="hidden md:grid md:grid-cols-[5fr_4fr] lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-stretch">

          {/* Featured review panel */}
          <div
            className="relative rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(237,250,250,0.6)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${TUSCAN}22`,
              boxShadow: `0 4px 40px ${TUSCAN}0E, inset 0 1px 0 rgba(255,255,255,0.8)`,
              minHeight: 380,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(to right, transparent, ${TUSCAN}, transparent)` }} />

            <AnimatePresence mode="wait" custom={mDir}>
              <motion.div
                key={mIdx}
                custom={mDir}
                variants={mobileVariants}
                initial={reduced ? false : "enter"}
                animate="center"
                exit={reduced ? {} : "exit"}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full p-8 lg:p-10"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} style={{ color: TUSCAN, fill: TUSCAN }} />
                  ))}
                </div>
                <p
                  className="font-cormorant font-light leading-relaxed flex-1 mb-8"
                  style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", color: "#0A1F1E" }}
                >
                  &ldquo;{top[mIdx].text}&rdquo;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-playfair font-bold text-base flex-shrink-0"
                    style={{ background: `${TUSCAN}20`, border: `1.5px solid ${TUSCAN}50`, color: TUSCAN }}
                  >
                    {top[mIdx].name[0]}
                  </div>
                  <div>
                    <p className="font-dm font-semibold text-sm" style={{ color: "#0A1F1E" }}>{top[mIdx].name}</p>
                    <p className="font-cinzel text-[9px] tracking-[0.25em] uppercase mt-0.5 opacity-50" style={{ color: SADDLE }}>
                      {top[mIdx].date}
                    </p>
                  </div>
                  <span
                    className="ml-auto font-cinzel text-[9px] tracking-[0.25em] uppercase px-3 py-1 rounded-full flex-shrink-0"
                    style={{ background: `${TUSCAN}12`, color: TUSCAN, border: `1px solid ${TUSCAN}30` }}
                  >
                    Google
                  </span>
                </div>
                <div className="flex gap-1.5 mt-6">
                  {top.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setMDir(i > mIdx ? 1 : -1); setMIdx(i); }}
                      aria-label={`Review ${i + 1}`}
                      className="rounded-full transition-all duration-400"
                      style={{ width: i === mIdx ? 20 : 6, height: 6, background: i === mIdx ? TUSCAN : `${SADDLE}25` }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Compact review list */}
          <div className="flex flex-col justify-center">
            {top.slice(0, 5).map((r, idx) => {
              const accent = ACCENTS[idx % ACCENTS.length];
              const isActive = idx === mIdx % 5;
              return (
                <div key={r.id}>
                  {idx > 0 && (
                    <div className="h-px" style={{ background: `linear-gradient(to right, ${accent}30, transparent)` }} />
                  )}
                  <motion.button
                    onClick={() => { setMDir(idx > mIdx ? 1 : -1); setMIdx(idx); }}
                    initial={reduced ? false : { opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="group w-full text-left py-5 relative flex items-start gap-4"
                  >
                    {isActive && (
                      <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full" style={{ background: accent }} />
                    )}
                    <div className="pl-3">
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} style={{ color: accent, fill: accent }} />
                        ))}
                      </div>
                      <p className="font-dm text-xs leading-relaxed line-clamp-2 mb-2"
                        style={{ color: isActive ? "#0A1F1E" : `${SADDLE}80` }}>
                        &ldquo;{r.text}&rdquo;
                      </p>
                      <p className="font-cinzel text-[9px] tracking-[0.25em] uppercase"
                        style={{ color: isActive ? accent : `${SADDLE}55` }}>
                        — {r.name}
                      </p>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Google CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-10 md:mt-12"
        >
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2.5 font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-all duration-300 group"
            style={{ color: SADDLE }}
          >
            See All Reviews on Google
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: TUSCAN }} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
