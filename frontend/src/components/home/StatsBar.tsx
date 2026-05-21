"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { PartyPopper, Star, Trophy, HeartHandshake } from "lucide-react";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";

const stats = [
  {
    value: 500,
    suffix: "+",
    label: "Events Decorated",
    sublabel: "Across Bengaluru",
    Icon: PartyPopper,
    color: TUSCAN,
    delay: 0,
    shape: "rounded-[40%_60%_70%_30%]"
  },
  {
    value: 5,
    suffix: "★",
    label: "Google Rating",
    sublabel: "Verified Reviews",
    Icon: Star,
    color: SADDLE,
    delay: 0.2,
    shape: "rounded-[60%_40%_30%_70%]"
  },
  {
    value: 8,
    suffix: "+",
    label: "Years Experience",
    sublabel: "In Event Décor",
    Icon: Trophy,
    color: TUSCAN,
    delay: 0.1,
    shape: "rounded-[50%_50%_40%_60%]"
  },
  {
    value: 100,
    suffix: "%",
    label: "Happy Clients",
    sublabel: "Satisfaction Rate",
    Icon: HeartHandshake,
    color: SADDLE,
    delay: 0.3,
    shape: "rounded-[30%_70%_50%_50%]"
  },
];

function SpringCounter({ value, inView, accent }: any) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 40, damping: 15 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return springVal.on("change", (v) => setDisplay(Math.round(v)));
  }, [springVal]);

  return <span style={{ color: accent }}>{display}</span>;
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section 
      ref={ref}
      className="relative py-12 md:py-16 overflow-hidden bg-white border-y border-[#F1A80520]"
    >
      {/* ── PARTY MOOD DECOR ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Floating Particles (Confetti) */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
            className="absolute w-2 h-2 opacity-20"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 2 === 0 ? TUSCAN : SADDLE,
              borderRadius: i % 3 === 0 ? "50%" : "2px"
            }}
          />
        ))}
      </div>

      <div className="container-max relative z-10 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6">
          
          {/* Tagline Side */}
          <div className="flex-shrink-0 text-center md:text-left">
            <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#F1A805] block mb-1">
              Our Track Record
            </span>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold" style={{ color: SADDLE }}>
              Milestones of <em className="font-cormorant italic">Joy</em>
            </h2>
          </div>

          {/* Stats Side - Single Row */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-8 md:gap-16 lg:gap-24">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center md:items-start group"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-[#F1A80508] group-hover:bg-[#F1A80515] transition-colors">
                    <stat.Icon size={16} style={{ color: TUSCAN }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="font-playfair text-3xl md:text-4xl font-bold leading-none" style={{ color: SADDLE }}>
                    <SpringCounter value={stat.value} inView={inView} accent={SADDLE} />
                    <span className="text-lg md:text-xl text-[#F1A805] ml-0.5">{stat.suffix}</span>
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <p className="font-cinzel text-[8px] md:text-[9px] tracking-[0.2em] uppercase font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: SADDLE }}>
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
