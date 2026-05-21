"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import HeroSliderSkeleton from "./hero/HeroSliderSkeleton";
import BottomWave from "./hero/BottomWave";

interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  titleAccent: string;
  subtitle1: string;
  subtitle2: string;
  image: string;
  color: string;
  accentColor: string;
  bg: string;
  sortOrder: number;
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.3 } },
};

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    apiFetch<HeroSlide[]>("/hero-slides")
      .then((data) => Array.isArray(data) && setSlides(data))
      .catch(() => {});
  }, []);

  const goTo = useCallback((idx: number, d: number) => {
    setDirection(d);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length, 1), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => goTo((current + 1) % slides.length, 1), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [current, goTo, slides.length]);

  const slide = slides[current];

  if (!slide) return <HeroSliderSkeleton />;

  return (
    <section
      className="relative overflow-hidden w-full flex flex-col items-stretch justify-start min-h-[80vh] lg:min-h-[85vh]"
      style={{ background: slide.bg, transition: "background 1s ease" }}
    >
      {/* Leaf decorations */}
      <LeafDecoration position="top" color={slide.color} />
      <LeafDecoration position="bottom" color={slide.color} />

      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row h-full relative z-10">

        {/* Hero image */}
        <div className="relative w-full lg:w-[50%] xl:w-[55%] h-[45vh] lg:h-[85vh]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`photo-${slide.id}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.tag}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Desktop fade */}
          <div
            className="absolute top-0 right-0 bottom-0 pointer-events-none hidden lg:block"
            style={{ width: "30%", background: `linear-gradient(to right, transparent 0%, ${slide.bg} 100%)` }}
          />

          {/* Mobile organic blend */}
          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 z-10 lg:hidden pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 L100,100 L100,0 C75,40 25,40 0,0 Z" fill={slide.bg} />
            </svg>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-24 sm:h-32 lg:hidden z-0 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${slide.bg})` }}
          />
        </div>

        {/* Text content */}
        <div
          className="relative w-full lg:w-[50%] xl:w-[45%] flex items-center justify-center p-6 sm:p-10 pb-28 lg:p-16 z-20 -mt-12 lg:mt-0"
          style={{ backgroundColor: slide.bg }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center w-full max-w-lg mx-auto"
            >
              <motion.div custom={0} variants={textVariants} className="mb-4">
                <span className="font-cinzel text-xs sm:text-sm tracking-[0.4em] text-[#323b32]">{slide.tag}</span>
              </motion.div>

              <motion.h1 custom={1} variants={textVariants} className="flex flex-col items-center">
                <span className="font-playfair font-semibold leading-[1.1]" style={{ color: slide.color, fontSize: "clamp(2rem, 5vw, 4.5rem)" }}>
                  {slide.title}
                </span>
                <span className="font-cormorant italic leading-[1] mt-1" style={{ color: slide.accentColor, fontSize: "clamp(1.8rem, 4.5vw, 4rem)" }}>
                  {slide.titleAccent}
                </span>
              </motion.h1>

              {/* Heart divider */}
              <motion.div custom={2} variants={textVariants} className="flex items-center gap-4 my-4 sm:my-6 opacity-80">
                <span className="h-[1px] w-12 sm:w-16" style={{ backgroundColor: slide.color }} />
                <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke={slide.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="h-[1px] w-12 sm:w-16" style={{ backgroundColor: slide.color }} />
              </motion.div>

              <motion.div custom={3} variants={textVariants} className="flex flex-col items-center gap-2 mb-6 sm:mb-8">
                <span className="font-dm text-[10px] sm:text-xs tracking-[0.2em] font-medium text-center uppercase" style={{ color: slide.accentColor }}>
                  {slide.subtitle1}
                </span>
                <span className="font-dm text-[10px] sm:text-xs tracking-[0.2em] font-medium text-center uppercase" style={{ color: slide.accentColor }}>
                  {slide.subtitle2}
                </span>
              </motion.div>

              <motion.div custom={4} variants={textVariants}>
                <a
                  href="tel:8884447579"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-dm text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                  style={{ backgroundColor: slide.accentColor, color: "#fbf6f0", boxShadow: `0 10px 30px -10px ${slide.accentColor}80` }}
                >
                  EXPLORE COLLECTION
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <span className="font-cinzel text-xl sm:text-2xl font-bold tabular-nums leading-none" style={{ color: slide.color }}>
            0{current + 1}
          </span>
          <div className="flex flex-col gap-1.5">
            {slides.map((_: HeroSlide, i: number) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all duration-500"
                style={{ height: "3px", width: i === current ? 40 : 16, background: i === current ? slide.color : `${slide.accentColor}30` }}
              />
            ))}
          </div>
          <span className="font-cinzel text-xs tracking-widest hidden sm:block" style={{ color: `${slide.accentColor}80` }}>
            / 0{slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={prev}
            aria-label="Previous"
            className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ borderColor: `${slide.accentColor}30`, color: slide.accentColor }}
          >
            <ChevronLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: slide.color, color: "#fbf6f0" }}
          >
            <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <BottomWave />
    </section>
  );
}

/* Reusable leaf SVG decoration */
function LeafDecoration({ position, color }: { position: "top" | "bottom"; color: string }) {
  const isBottom = position === "bottom";
  return (
    <div
      className="absolute pointer-events-none opacity-30 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96"
      style={{ top: isBottom ? undefined : 0, bottom: isBottom ? 0 : undefined, right: 0 }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transform ${isBottom ? "translate-x-1/3 translate-y-1/3 rotate-180" : "translate-x-1/4 -translate-y-1/4"}`}
      >
        <path d="M150,10 C120,40 100,80 100,100 C100,120 120,160 150,190" stroke={color} strokeWidth="0.5" fill="none" />
        <path d="M120,30 C90,60 70,100 70,120 C70,140 90,180 120,210" stroke={color} strokeWidth="0.5" fill="none" />
        <path d="M100,100 C70,100 40,80 10,50" stroke={color} strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  );
}
