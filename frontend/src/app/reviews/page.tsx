"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import CTABanner from "@/components/home/CTABanner";

function AnimatedStars({ rating, delay = 0 }: { rating: number; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <motion.span
          key={s}
          initial={reduced ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + s * 0.06, type: "spring", stiffness: 400, damping: 20 }}
        >
          <Star size={14} className={s <= rating ? "text-primary fill-primary" : "text-text-muted"} />
        </motion.span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");
  const [shown, setShown]   = useState(9);
  const reduced = useReducedMotion();

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.rating === Number(filter));
  const visible  = filtered.slice(0, shown);

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
            <span className="font-cinzel text-xs tracking-[0.3em] text-primary uppercase">Testimonials</span>
            <h1 className="section-heading mt-2">
              Client{" "}
              <em className="font-cormorant not-italic text-gradient-gold">Reviews</em>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <motion.span
                    key={s}
                    initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: s * 0.08, type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Star size={24} className="text-primary fill-primary" />
                  </motion.span>
                ))}
              </div>
              <div className="text-left">
                <div className="font-playfair text-3xl font-bold text-light">5.0</div>
                <div className="font-dm text-text-muted text-sm">Based on 500+ reviews</div>
              </div>
              <div className="text-3xl font-bold text-[#4285F4] ml-2">G</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 px-4 bg-dark border-b border-primary/10">
        <div className="container-max flex gap-2 justify-center flex-wrap">
          {[["all", "All Reviews"], ["5", "5 Star ★★★★★"], ["4", "4 Star ★★★★"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setFilter(val); setShown(9); }}
              className={`px-4 py-2 rounded-full font-cinzel text-xs tracking-widest uppercase transition-all min-h-[40px] ${
                filter === val ? "bg-primary text-white" : "border border-primary/30 text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="section-padding bg-dark">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((r, i) => (
              <motion.div
                key={r.id}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.45 }}
                className="glass-card rounded-2xl p-6 relative"
              >
                {/* Decorative quote */}
                <span className="absolute top-3 right-4 font-playfair text-6xl text-primary/10 leading-none select-none pointer-events-none">
                  &ldquo;
                </span>

                <div className="flex items-start justify-between mb-3">
                  <AnimatedStars rating={r.rating} delay={(i % 3) * 0.1} />
                  <span className="text-xl font-bold text-[#4285F4]">G</span>
                </div>
                <p className="font-dm text-text-muted text-sm leading-relaxed mb-4 relative z-10">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-dm font-semibold text-light text-sm">{r.name}</div>
                    <div className="font-dm text-text-muted text-xs">{r.date}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center font-playfair font-bold text-primary text-sm">
                    {r.name[0]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {shown < filtered.length && (
            <div className="text-center mt-8">
              <button onClick={() => setShown((s) => s + 9)} className="btn-outline">
                Load More Reviews
              </button>
            </div>
          )}

          <div className="text-center mt-8">
            <a href="https://g.page/r/review" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Leave a Review on Google
            </a>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
