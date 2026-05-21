"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { servicesApi } from "@/lib/api";
import type { ServiceSummary } from "@/lib/api";
import { SADDLE, TUSCAN, ACCENTS } from "@/lib/theme";
import DesktopCard from "./services/DesktopCard";
import MobileCard from "./services/MobileCard";
import { DesktopCardSkeleton, MobileCardSkeleton } from "./services/Skeletons";

interface Props { limit?: number; }

const MOBILE_PAGE = 3;

export default function ServicesGrid({ limit }: Props) {
  const [allServices, setAllServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [mobileStart, setMobileStart] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    servicesApi.list()
      .then(setAllServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allServices.map((s) => s.category)));
    return [
      { id: "all", label: "All" },
      ...unique.map((c) => ({
        id: c,
        label: c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " "),
      })),
    ];
  }, [allServices]);

  const filtered = (
    activeCategory === "all"
      ? allServices
      : allServices.filter((s) => s.category === activeCategory)
  ).slice(0, limit ?? allServices.length);

  const mobileSlice = filtered.slice(mobileStart, mobileStart + MOBILE_PAGE);
  const canPrev = mobileStart > 0;
  const canNext = mobileStart + MOBILE_PAGE < filtered.length;

  return (
    <section
      className="relative overflow-hidden pt-4 pb-20 px-4 md:px-6 -mt-10 md:-mt-15"
      style={{ background: "linear-gradient(180deg, #EDFAFA 0%, #E8F6F5 100%)" }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-64 blur-[120px] opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${TUSCAN}, transparent)` }}
      />

      <div className="container-max relative z-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        />

        {/* Category filter pills */}
        {!limit && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-2 flex-wrap justify-center mb-10 md:mb-14"
          >
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setMobileStart(0); }}
                  className="font-cinzel text-[10px] tracking-[0.25em] uppercase px-4 py-2 rounded-full transition-all duration-300"
                  style={{
                    background: active ? TUSCAN : "rgba(132,87,47,0.07)",
                    color: active ? "#020608" : SADDLE,
                    border: active ? `1.5px solid ${TUSCAN}` : `1.5px solid ${SADDLE}22`,
                    boxShadow: active ? `0 4px 20px ${TUSCAN}40` : "none",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Mobile: paged cards */}
        <div className="block md:hidden">
          {loading ? (
            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, i) => <MobileCardSkeleton key={i} />)}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${mobileStart}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-5"
              >
                {mobileSlice.map((service, i) => (
                  <MobileCard
                    key={service.id}
                    service={service}
                    accent={ACCENTS[(mobileStart + i) % ACCENTS.length]}
                    index={i}
                    reduced={!!reduced}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex items-center justify-between mt-3 px-2">
            <span className="font-cinzel text-xs" style={{ color: `${SADDLE}80` }}>
              {Math.floor(mobileStart / MOBILE_PAGE) + 1} / {Math.ceil(filtered.length / MOBILE_PAGE)}
            </span>
            <div className="flex gap-3">
              <button
                disabled={!canPrev}
                onClick={() => setMobileStart((s) => Math.max(0, s - MOBILE_PAGE))}
                className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ borderColor: `${SADDLE}30`, color: SADDLE }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!canNext}
                onClick={() => setMobileStart((s) => Math.min(filtered.length - 1, s + MOBILE_PAGE))}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ background: TUSCAN, color: "#020608" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: limit ?? 8 }).map((_, i) => <DesktopCardSkeleton key={i} />)
            : filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={reduced ? false : { opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i % 4) * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DesktopCard service={service} accent={ACCENTS[i % ACCENTS.length]} index={i} />
                </motion.div>
              ))
          }
        </div>

        {/* View all CTA */}
        {limit && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-14"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-9 py-4 font-cinzel text-xs tracking-[0.3em] uppercase font-medium transition-all duration-300 group"
              style={{ border: `1.5px solid ${TUSCAN}60`, color: SADDLE }}
            >
              View All Services
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: TUSCAN }}
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
