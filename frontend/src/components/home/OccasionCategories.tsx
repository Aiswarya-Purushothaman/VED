"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* ── Palette ── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";

const CATEGORIES = [
  {
    label: "Weddings",
    href: "/services?cat=wedding",
    image: "/services/service_wedding.png",
    shape: "rounded-t-full",
    desc: "Royal Vows"
  },
  {
    label: "Anniversary",
    href: "/services?cat=anniversary",
    image: "/services/service_anniversary.png",
    shape: "rounded-full",
    desc: "Years of Love"
  },
  {
    label: "Birthdays",
    href: "/services?cat=birthday",
    image: "/services/service_birthday.png",
    shape: "rounded-tr-[50px] rounded-bl-[50px]",
    desc: "Joyful Bash"
  },
  {
    label: "Baby Shower",
    href: "/services?cat=baby-shower",
    image: "/services/service_babyshower.png",
    shape: "rounded-full",
    desc: "New Beginnings"
  },
  {
    label: "Proposals",
    href: "/services?cat=proposal",
    image: "/services/service_proposal.png",
    shape: "rounded-tr-[50px] rounded-bl-[50px]",
    desc: "Say Yes"
  },
  {
    label: "Corporate",
    href: "/services?cat=corporate",
    image: "/services/service_corporate.png",
    shape: "rounded-2xl",
    desc: "Excellence"
  },
  {
    label: "Candlelight",
    href: "/services?cat=candlelight",
    image: "/services/service_candlelight.png",
    shape: "rounded-b-full",
    desc: "Romantic Glow"
  }
];

export default function OccasionCategories() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-[#fcf6ef] pt-10 pb-0">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vh] rounded-full blur-[120px]" style={{ background: `radial-gradient(circle, ${TUSCAN}20, transparent)` }} />
      </div>

      <div className="container-max relative z-10 w-full px-4 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[#84572F] block mb-2 opacity-60">
            Our Celebrations Lineup
          </span>

        </motion.div>

        {/* ── THE SINGLE LINE MINIATURES ── */}
        <div className="relative">
          {/* Subtle horizontal track line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#84572F15] to-transparent -translate-y-1/2" />

          <div className="flex items-center justify-between gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-10 px-4 md:px-0">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex-shrink-0 group"
              >
                <Link href={cat.href} className="flex flex-col items-center gap-6">
                  {/* The Miniature Shape */}
                  <div
                    className={`relative w-24 h-32 md:w-32 md:h-44 overflow-hidden border-2 border-white shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 ${cat.shape}`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Label & Description */}
                  <div className="text-center">
                    <h3 className="font-playfair text-sm md:text-base font-semibold text-[#84572F] mb-1">
                      {cat.label}
                    </h3>
                    <p className="font-cinzel text-[7px] md:text-[8px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" style={{ color: TUSCAN }}>
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
