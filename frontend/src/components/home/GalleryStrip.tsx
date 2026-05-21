"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, ZoomIn, Sparkles } from "lucide-react";
import { galleryApi } from "@/lib/api";
import type { GalleryImage } from "@/lib/api";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";
const BREEZE = "#92ADA4";

/* Cycle accent tints for category labels */
const ACCENTS = [TUSCAN, BREEZE, BUTTER, SADDLE];

export default function GalleryStrip() {
  const [allImages, setAllImages]   = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox]     = useState<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    galleryApi.list().then(setAllImages).catch(() => {});
  }, []);

  const imgs = allImages.slice(0, 10);

  const prev = useCallback(
    () => setLightbox((l) => ((l ?? 0) - 1 + imgs.length) % imgs.length),
    [imgs.length]
  );
  const next = useCallback(
    () => setLightbox((l) => ((l ?? 0) + 1) % imgs.length),
    [imgs.length]
  );

  /* Keyboard navigation for lightbox */
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, next, prev]);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#fdfaf6]">
      {/* ── BACKGROUND WATERMARK TEXT ── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-10 opacity-[0.03]">
        <div className="font-cinzel text-[15vw] leading-none whitespace-nowrap -ml-[10%] select-none">
          CELEBRATING MOMENTS CELEBRATING MOMENTS
        </div>
        <div className="font-cinzel text-[15vw] leading-none whitespace-nowrap -ml-[30%] select-none">
          CELEBRATING MOMENTS CELEBRATING MOMENTS
        </div>
        <div className="font-cinzel text-[15vw] leading-none whitespace-nowrap -ml-[5%] select-none">
          CELEBRATING MOMENTS CELEBRATING MOMENTS
        </div>
      </div>

      <div className="container-max relative z-10 px-4">
        {/* Expanded High-Density Collage — only render once we have enough images */}
        {imgs.length < 10 ? null : <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 lg:gap-5 items-center">
          
          {/* Column 1 - Far Left Fragments */}
          <div className="flex flex-col gap-3 md:gap-5">
             <motion.button
                onClick={() => setLightbox(6)}
                className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Image src={imgs[6].src} alt={imgs[6].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
             <motion.button
                onClick={() => setLightbox(1)}
                className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-lg group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Image src={imgs[1].src} alt={imgs[1].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
             <motion.button
                onClick={() => setLightbox(7)}
                className="relative aspect-square rounded-full overflow-hidden shadow-lg group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Image src={imgs[7].src} alt={imgs[7].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
          </div>

          {/* Column 2 - Left Mid Stack */}
          <div className="flex flex-col gap-3 md:gap-5 md:pt-12">
             <motion.button
                onClick={() => setLightbox(2)}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Image src={imgs[2].src} alt={imgs[2].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
             <motion.button
                onClick={() => setLightbox(8)}
                className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Image src={imgs[8].src} alt={imgs[8].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
          </div>

          {/* Column 3 - Central Hero Pillar */}
          <motion.button
            onClick={() => setLightbox(0)}
            className="relative col-span-2 md:col-span-1 aspect-[2/3] md:aspect-[3/6] rounded-[5rem] md:rounded-[15rem] overflow-hidden shadow-2xl z-20 group"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image src={imgs[0].src} alt={imgs[0].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 flex items-end justify-center pb-12">
              <span className="font-cinzel text-white text-xl md:text-2xl tracking-[0.4em] uppercase text-center leading-relaxed">
                Life's <br/> Best <br/> Moments
              </span>
            </div>
          </motion.button>

          {/* Column 4 - Right Mid Stack */}
          <div className="flex flex-col gap-3 md:gap-5 md:pb-12">
             <motion.button
                onClick={() => setLightbox(3)}
                className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl group"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Image src={imgs[3].src} alt={imgs[3].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
             <motion.button
                onClick={() => setLightbox(9)}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-lg group"
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Image src={imgs[9].src} alt={imgs[9].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
          </div>

          {/* Column 5 - Far Right Fragments */}
          <div className="flex flex-col gap-3 md:gap-5">
             <motion.button
                onClick={() => setLightbox(4)}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Image src={imgs[4].src} alt={imgs[4].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
             <motion.button
                onClick={() => setLightbox(5)}
                className="relative aspect-square rounded-full overflow-hidden shadow-lg group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Image src={imgs[5].src} alt={imgs[5].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
             <motion.button
                onClick={() => setLightbox(6)}
                className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Image src={imgs[6].src} alt={imgs[6].alt ?? "Gallery image"} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             </motion.button>
          </div>

        </div>}

        {/* Explore All Link */}
        <div className="mt-16 text-center">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-4 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[#84572F] hover:text-[#F1A805] transition-colors"
          >
            Open Full Gallery
            <span className="w-12 h-px bg-[#F1A805] group-hover:w-20 transition-all duration-500" />
          </Link>
        </div>
      </div>

      {/* ── LIGHTBOX (Same logic, luxury styling) ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <div className="relative w-full max-w-5xl aspect-[4/3] group" onClick={e => e.stopPropagation()}>
              <Image
                src={imgs[lightbox].src}
                alt={imgs[lightbox].alt ?? "Gallery image"}
                fill
                className="object-contain"
              />
              
              {/* Controls */}
              <button onClick={() => setLightbox(null)} className="absolute top-0 right-0 p-4 text-white/50 hover:text-white">
                <X size={32} />
              </button>
              
              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white hover:scale-110 transition-all">
                <ChevronLeft size={48} />
              </button>
              
              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white hover:scale-110 transition-all">
                <ChevronRight size={48} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
