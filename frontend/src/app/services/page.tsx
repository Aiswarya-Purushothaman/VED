"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { servicesApi } from "@/lib/api";
import type { ServiceSummary } from "@/lib/api";
import CTABanner from "@/components/home/CTABanner";

const PAGE_SIZE = 12;


function deriveCategories(services: ServiceSummary[]) {
  const unique = Array.from(new Set(services.map((s) => s.category)));
  return [
    { id: "all", label: "All" },
    ...unique.map((c) => ({
      id: c,
      label: c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " "),
    })),
  ];
}

export default function ServicesPage() {
  const [allServices, setAllServices]       = useState<ServiceSummary[]>([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage]       = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);
  const reduced   = useReducedMotion();

  useEffect(() => {
    servicesApi.list()
      .then(setAllServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function scrollFilter(dir: "left" | "right") {
    filterRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }

  const categories = useMemo(() => deriveCategories(allServices), [allServices]);

  const filtered = useMemo(
    () => activeCategory === "all" ? allServices : allServices.filter((s) => s.category === activeCategory),
    [activeCategory, allServices],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleCategoryChange(id: string) { setActiveCategory(id); setCurrentPage(1); }

  function goToPage(page: number) {
    setCurrentPage(page);
    document.getElementById("services-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 bg-dark-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-cinzel text-xs tracking-[0.3em] text-primary uppercase">Our Services</span>
            <h1 className="section-heading mt-2">
              All Our{" "}
              <em className="font-cormorant not-italic text-gradient-gold">Decoration Services</em>
            </h1>
            <p className="font-dm text-text-muted text-lg mt-4 max-w-xl mx-auto">
              From intimate setups to grand celebrations — we bring your vision to life.
            </p>
            <p className="font-cinzel text-xs text-primary/60 mt-3 tracking-widest uppercase">
              {allServices.length > 0 ? `${allServices.length}+` : "Many"} Services Available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter bar */}
      <section className="py-6 px-4 bg-dark sticky top-[64px] md:top-[80px] z-30 border-b border-primary/10">
        <div className="container-max">
          <div className="relative flex items-center gap-2">
            <button onClick={() => scrollFilter("left")} aria-label="Scroll left" className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-primary/30 text-text-muted hover:border-primary hover:text-primary transition-all">
              <ChevronLeft size={15} />
            </button>

            <div ref={filterRef} className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative flex-shrink-0 px-4 py-2 rounded-full font-cinzel text-xs tracking-widest uppercase transition-all min-h-[40px] overflow-hidden ${
                    activeCategory === cat.id
                      ? "bg-primary text-white"
                      : "border border-primary/30 text-text-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {activeCategory === cat.id && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  {cat.label}
                </button>
              ))}
            </div>

            <button onClick={() => scrollFilter("right")} aria-label="Scroll right" className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-primary/30 text-text-muted hover:border-primary hover:text-primary transition-all">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="services-grid" className="section-padding bg-dark scroll-mt-40">
        <div className="container-max">

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-white/5 rounded-lg w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-white/5 rounded w-full" />
                      <div className="h-3 bg-white/5 rounded w-5/6" />
                    </div>
                    <div className="h-3 bg-white/5 rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {totalPages > 1 && (
                <p className="font-cinzel text-xs text-text-muted uppercase tracking-wider text-right mb-6">
                  Page {currentPage} / {totalPages}
                </p>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${currentPage}`}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {paginated.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={reduced ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                      whileHover={reduced ? {} : { y: -6 }}
                      className="flex"
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_rgba(0,166,147,0.15)] w-full"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="absolute bottom-3 right-3 font-cinzel text-xs text-primary/80 uppercase tracking-wider bg-dark-card/70 px-2 py-1 rounded backdrop-blur-sm">
                            {service.category}
                          </span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-cormorant text-xl font-semibold text-light mb-2 group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                          <p className="font-dm text-text-muted text-sm leading-relaxed mb-4 flex-1">{service.shortDesc}</p>
                          <span className="inline-flex items-center gap-1 text-primary font-dm text-sm font-medium group-hover:gap-2.5 transition-all mt-auto">
                            View Details <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-full border border-primary/30 font-cinzel text-xs uppercase tracking-wider text-text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const active  = page === currentPage;
                    const nearby  = Math.abs(page - currentPage) <= 1;
                    const isFirst = page === 1;
                    const isLast  = page === totalPages;
                    if (!isFirst && !isLast && !nearby) {
                      if (page === currentPage - 2 || page === currentPage + 2)
                        return <span key={page} className="text-text-muted px-1 self-center">…</span>;
                      return null;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-full font-cinzel text-sm transition-all ${
                          active
                            ? "bg-primary text-white font-semibold shadow-lg shadow-primary/30"
                            : "border border-primary/30 text-text-muted hover:border-primary hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-full border border-primary/30 font-cinzel text-xs uppercase tracking-wider text-text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      <CTABanner />
    </>
  );
}
