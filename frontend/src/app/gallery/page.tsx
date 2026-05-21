"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MessageCircle, ZoomIn } from "lucide-react";
import { galleryApi } from "@/lib/api";
import type { GalleryImage } from "@/lib/api";
import { buildWhatsAppURL } from "@/lib/whatsapp";
import CTABanner from "@/components/home/CTABanner";


export default function GalleryPage() {
  const [allImages, setAllImages]     = useState<GalleryImage[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("All");
  const [lightbox, setLightbox]       = useState<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    galleryApi.list()
      .then(setAllImages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filters = useMemo(() => {
    const cats = Array.from(new Set(allImages.map((i) => i.category).filter(Boolean))) as string[];
    return ["All", ...cats];
  }, [allImages]);

  const filtered = filter === "All" ? allImages : allImages.filter((i) => i.category === filter);

  const prev = () => setLightbox((l) => ((l ?? 0) - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox((l) => ((l ?? 0) + 1) % filtered.length);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 bg-dark-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container-max text-center relative z-10">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-cinzel text-xs tracking-[0.3em] text-primary uppercase">Our Portfolio</span>
            <h1 className="section-heading mt-2">
              Our{" "}
              <em className="font-cormorant not-italic text-gradient-gold">Gallery</em>
            </h1>
            <p className="font-dm text-text-muted text-lg mt-4 max-w-xl mx-auto">
              Browse through our beautiful decoration setups and get inspired.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-6 px-4 bg-dark border-b border-primary/10 sticky top-[64px] md:top-[80px] z-30">
        <div className="container-max">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative flex-shrink-0 px-4 py-2 rounded-full font-cinzel text-xs tracking-widest uppercase transition-all min-h-[40px] overflow-hidden ${
                  filter === f ? "bg-primary text-white" : "border border-primary/30 text-text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="gallery-filter-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                {f === "All" ? "All" : f.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="section-padding bg-dark">
        <div className="container-max">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[220, 160, 280, 180, 240, 160, 200, 260, 150, 230, 170, 210].map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-xl break-inside-avoid animate-pulse bg-white/5"
                  style={{ height: h }}
                />
              ))}
            </div>
          ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? {} : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
            >
              {filtered.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  onClick={() => setLightbox(i)}
                  className="w-full block overflow-hidden rounded-xl group break-inside-avoid"
                >
                  <div className="relative overflow-hidden" style={{ minHeight: 180 }}>
                    <Image
                      src={img.src}
                      alt={img.alt ?? img.category ?? "Gallery image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-3 gap-1">
                      <ZoomIn size={20} className="text-white drop-shadow" />
                      <span className="font-cinzel text-white text-[10px] tracking-widest uppercase drop-shadow">
                        {img.category ?? ""}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={reduced ? false : { scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? {} : { scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-3xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) next();
                else if (info.offset.x > 60) prev();
              }}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt ?? filtered[lightbox].category ?? "Gallery image"}
                fill
                className="object-contain rounded-xl"
                sizes="90vw"
              />

              <div className="absolute -bottom-14 left-0 right-0 flex justify-center">
                <a
                  href={buildWhatsAppURL(`Hi! I love this decoration style (${filtered[lightbox].category ?? "this style"}). Could you create something similar?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-sm"
                >
                  <MessageCircle size={16} /> Book This Style
                </a>
              </div>

              <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute top-2 right-2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white hover:text-primary transition-colors z-10">
                <X size={18} />
              </button>
              <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white hover:text-primary transition-colors z-10">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white hover:text-primary transition-colors z-10">
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <span className="font-cinzel text-white/60 text-[10px] tracking-widest uppercase">
                  {lightbox + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTABanner />
    </>
  );
}
