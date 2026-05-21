"use client";
import { motion, useReducedMotion } from "framer-motion";
import { PhoneCall, Paintbrush2, Sparkles } from "lucide-react";

/* ── Palette ──────────────────────────────────────── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";
const BREEZE = "#92ADA4";

/* ── Step data ────────────────────────────────────── */
const steps = [
  {
    step: "01",
    Icon: PhoneCall,
    title: "Call or WhatsApp Us",
    desc: "Reach out via phone or WhatsApp to discuss your event vision, date, and budget. We respond within 2 hours!",
    accent: TUSCAN,
    bg: `${TUSCAN}12`,
    border: `${TUSCAN}30`,
    glow: `${TUSCAN}22`,
  },
  {
    step: "02",
    Icon: Paintbrush2,
    title: "We Plan Your Setup",
    desc: "Our creative team designs a personalised decoration plan tailored specifically to your theme, space, and preferences.",
    accent: BREEZE,
    bg: `${BREEZE}12`,
    border: `${BREEZE}30`,
    glow: `${BREEZE}22`,
  },
  {
    step: "03",
    Icon: Sparkles,
    title: "We Decorate, You Celebrate",
    desc: "Our professional team arrives on time, transforms your space, and makes sure every detail is picture-perfect.",
    accent: BUTTER,
    bg: `${BUTTER}18`,
    border: `${BUTTER}40`,
    glow: `${BUTTER}25`,
  },
];

export default function HowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-[#fcf6ef]">
      {/* ── Background Aesthetics ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[100px]" style={{ background: `radial-gradient(circle, ${TUSCAN}20, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full blur-[80px]" style={{ background: `radial-gradient(circle, ${BUTTER}30, transparent)` }} />
      </div>

      <div className="container-max relative z-10 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[#F1A805] block mb-2">
            The Celebration Blueprint
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold" style={{ color: SADDLE }}>
            Three Steps to <em className="font-cormorant italic">Perfect</em> Moments
          </h2>
        </div>

        {/* ── THE STEPS — Single Line / Horizontal Scroll on Mobile ── */}
        <div className="relative">
          {/* Animated Connecting Path (Desktop) */}
          <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-px border-t-2 border-dashed border-[#F1A80530] -z-0" />
          
          {/* Connecting Path (Mobile) */}
          <div className="md:hidden absolute top-[48px] left-0 right-0 h-px border-t border-dashed border-[#F1A80530] -z-0" />

          <div className="flex md:grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-12 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex-shrink-0 w-[70vw] md:w-auto relative flex flex-col items-center text-center group"
              >
                {/* Step Circle */}
                <div 
                  className="relative z-10 w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 border border-[#F1A80510] group-hover:scale-110 transition-transform duration-500"
                >
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#F1A80530]" />
                  <step.Icon size={32} style={{ color: TUSCAN }} className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-[10px] font-bold shadow-lg border border-white"
                    style={{ background: TUSCAN, color: "white" }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-playfair text-lg md:text-xl font-bold mb-3" style={{ color: SADDLE }}>
                  {step.title}
                </h3>
                <p className="font-dm text-xs leading-relaxed text-[#84572F] opacity-70 max-w-[25ch]">
                  {step.desc}
                </p>

                {/* Decorative Sparkle (Party Mood) */}
                <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles size={16} className="text-[#F1A805] animate-pulse" />
                </div>
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
