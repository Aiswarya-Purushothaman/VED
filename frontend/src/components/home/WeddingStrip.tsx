"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ── Wedding items to showcase ── */
const ITEMS = [
  {
    slug: "wedding-decorations",
    name: "Wedding Decorations",
    image: "/services/service_wedding.png",
    accent: "#F1A805",
  },
  {
    slug: "engagement-ceremony",
    name: "Engagement Ceremony",
    image: "/services/wedding_engagement.png",
    accent: "#E8C97E",
  },
  {
    slug: "mehndi-ceremony",
    name: "Mehndi Ceremony",

    image: "/services/wedding_mehndi.png",
    accent: "#92ADA4",
  },
  {
    slug: "haldi-ceremony",
    name: "Haldi Ceremony",

    image: "/services/wedding_haldi.png",
    accent: "#F1A805",
  },
  {
    slug: "reception-decor",
    name: "Wedding Reception",

    image: "/services/wedding_reception.png",
    accent: "#F2D6A1",
  },
  {
    slug: "sangeet-night",
    name: "Sangeet Night",

    image: "/services/wedding_sangeet.png",
    accent: "#84572F",
  },
  {
    slug: "bridal-suite-decoration",
    name: "Bridal Suite",

    image: "/services/wedding_bridal.png",
    accent: "#E8C97E",
  },
  {
    slug: "floral-wall-installation",
    name: "Floral Wall",
    image: "/services/service_premium.png",
    accent: "#92ADA4",
  },
];

/* Duplicate items for seamless infinite loop */
const TRACK = [...ITEMS, ...ITEMS];

const TERRACOTTA = "#b87a6c";
const OLIVE = "#5c674b";
const SADDLE = "#84572F";
const CREAM = "#fcf6ef";

export default function WeddingStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative overflow-hidden py-14"
      style={{ background: CREAM }}
    >


      {/* ── Ambient glow ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-48 blur-[100px] opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${TERRACOTTA}, transparent)` }}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 px-4"
      >
        <span
          className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.45em] uppercase mb-3"
          style={{ color: OLIVE }}
        >
          <span className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${OLIVE})` }} />
          Wedding Ceremonies
          <span className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${OLIVE})` }} />
        </span>
        <h2
          className="font-playfair font-bold"
          style={{ color: SADDLE, fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
        >
          Every Ritual,{" "}
          <em className="font-cormorant not-italic" style={{ color: TERRACOTTA }}>
            Beautifully Adorned
          </em>
        </h2>
      </motion.div>

      {/* ── Wide Banner Image ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1400px] mx-auto px-4 md:px-6 mb-12"
      >
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[16/7] md:aspect-[24/7] lg:aspect-[32/8]">
          <Image
            src="/featured-banner.jpg"
            alt="Luxury Wedding Setup Highlights"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1400px) 100vw, 1400px"
          />
          {/* Subtle gradient overlay for elegance */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </motion.div>

      {/* ── Infinite scroll track ── */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${CREAM}, transparent)` }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${CREAM}, transparent)` }}
        />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{
            animation: "weddingScroll 40s linear infinite",
            width: "max-content",
          }}
        >
          {TRACK.map((item, i) => (
            <WeddingCard key={i} item={item} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mt-10"
      >
        <Link
          href="/services?category=wedding"
          className="inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.35em] uppercase transition-all duration-300 hover:opacity-70"
          style={{ color: TERRACOTTA }}
        >
          <span className="w-6 h-px" style={{ background: TERRACOTTA }} />
          View All Wedding Services
          <span className="w-6 h-px" style={{ background: TERRACOTTA }} />
        </Link>
      </motion.div>

      {/* ── Keyframe ── */}
      <style>{`
        @keyframes weddingScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>


    </section>
  );
}

/* ── Card ── */
function WeddingCard({ item }: { item: typeof ITEMS[0] }) {
  return (
    <Link
      href={`/services/${item.slug}`}
      className="group relative flex-shrink-0 rounded-2xl overflow-hidden block"
      style={{ width: "220px", height: "300px" }}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="220px"
        loading="lazy"
      />

      {/* Light gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: "( rgba(252,246,239,0.5) 40%, transparent 75%)",
        }}
      />

      {/* Accent overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to top, ${item.accent}30 0%, transparent 60%)` }}
      />

      {/* Accent left thread */}
      <div
        className="absolute left-0 top-6 bottom-6 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"
        style={{ background: `linear-gradient(to bottom, transparent, ${item.accent}, transparent)` }}
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
        <h3
          className="font-cormorant font-semibold leading-tight"
          style={{ color: SADDLE, fontSize: "1.1rem" }}
        >
          {item.name}
        </h3>
        <span
          className="inline-flex items-center gap-1 font-cinzel text-[8px] tracking-[0.3em] uppercase mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: item.accent }}
        >
          Explore →
        </span>
      </div>
    </Link>
  );
}
