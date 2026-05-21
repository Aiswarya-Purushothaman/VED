"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { servicesApi } from "@/lib/api";
import type { ServiceSummary } from "@/lib/api";

/* ── Palette ── */
const SADDLE = "#84572F";
const BUTTER = "#F2D6A1";

export default function SpecialOccasions() {
  const [specialServices, setSpecialServices] = useState<ServiceSummary[]>([]);

  useEffect(() => {
    servicesApi.list("special").then(setSpecialServices).catch(() => {});
  }, []);

  return (
    <section className="relative py-24 md:py-10 px-10 overflow-hidden bg-[#fcf6ef]">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ background: `radial-gradient(circle, ${BUTTER}40, transparent)` }} />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end px-6 md:px-12 mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[#F1A805] block mb-4">
              Beyond the Ordinary
            </span>
            <h2 className="font-playfair text-4xl md:text-6xl font-bold leading-tight" style={{ color: SADDLE }}>
              Celebrating Every <br /> <em className="font-cormorant italic">Special</em> Moment
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-dm text-base md:text-lg text-[#84572F] opacity-70 max-w-md lg:ml-auto"
          >
            From the joy of graduation to the legacy of retirement, we design environments that honor your life&apos;s most unique milestones.
          </motion.p>
        </div>

        {/* ── THE SPECIAL CARDS — Horizontal Scroll ── */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-2 z-10 pointer-events-none " />

          <div className="flex gap-2 md:gap-8 overflow-x-auto no-scrollbar pb-10 -mx-6 px-2">
            {specialServices.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-[350px] group"
              >
                <Link href={`/services/${item.slug}`} className="block">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl mb-6">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Tag */}
                    <div className="absolute top-6 left-6">
                      <span
                        className="px-4 py-1.5 rounded-full font-cinzel text-[8px] tracking-widest uppercase border border-white/30 backdrop-blur-md text-white"
                      >
                        Special Occasion
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <h3 className="font-playfair text-2xl text-white mb-2 group-hover:text-[#F1A805] transition-colors">
                        {item.name}
                      </h3>
                      <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-500 ease-out">
                        <p className="font-dm text-xs text-white/60 leading-relaxed">
                          {item.shortDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link
            href="/services?cat=special"
            className="group inline-flex items-center gap-4 font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#84572F] hover:text-[#F1A805] transition-colors"
          >
            Explore All Special Occasions
            <span className="w-8 h-px bg-[#84572F] group-hover:w-16 group-hover:bg-[#F1A805] transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Hiding scrollbars
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = '.no-scrollbar::-webkit-scrollbar { display: none; }';
  document.head.appendChild(style);
}
