"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

/* ── Palette ── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";
const TERRACOTTA = "#b87a6c";

export default function BirthdayStrip() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden min-h-[90vh] lg:min-h-screen flex items-center"
      style={{
        background: "linear-gradient(to bottom, #fcf6ef, #fff)",
      }}
    >
      {/* ── Floating Party Decorations (Background) ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingBalloon color="#F1A805" size={40} top="15%" left="5%" delay={0} />
        <FloatingBalloon color="#b87a6c" size={30} top="45%" left="2%" delay={2} />
        <FloatingBalloon color="#F1A805" size={35} top="20%" right="5%" delay={1.5} />
        <FloatingBalloon color="#92ADA4" size={45} top="55%" right="2%" delay={0.5} />
        
        {/* Confetti Particles */}
        {[...Array(12)].map((_, i) => (
          <Confetti key={i} />
        ))}
      </div>

      <div className="container-max relative z-10 px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* ── LEFT SIDE: CONTENT ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#F1A805]" />
              <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[#84572F]">
                The Art of Celebration
              </span>
            </div>
            <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: SADDLE }}>
              The Perfect <br />
              <em className="font-cormorant italic font-medium text-[#b87a6c]">Birthday</em> Layout
            </h2>
            <p className="font-dm text-base md:text-lg text-[#84572F] opacity-70 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              From intimate surprises to grand ballroom bashes, we layer your special day with magic, one tier at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <Link
                href="/services?category=birthday"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-cinzel text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
                style={{
                  background: SADDLE,
                  color: "#fff",
                }}
              >
                Plan My Party
              </Link>
              <Link 
                href="/gallery" 
                className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#84572F] hover:text-[#F1A805] transition-colors"
              >
                View Collection →
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT SIDE: THE CAKE ── */}
          <div className="relative flex flex-col items-center gap-4 md:gap-6 scale-90 lg:scale-100">
            
            {/* TIER 1: The Top (Petite & Sweet) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-full max-w-[240px] md:max-w-[280px] group z-30"
            >
              <div className="relative aspect-[4/3] rounded-t-[100px] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="/services/birthday_first.png" 
                  alt="First Birthday Photoshoot" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-center">
                  <h3 className="font-playfair text-xl text-white">First Birthday</h3>
                </div>
              </div>
            </motion.div>

            {/* TIER 2: The Middle (Shared Joy) */}
            <div className="w-full max-w-[500px] md:max-w-[600px] grid grid-cols-2 gap-4 z-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white group"
              >
                <Image 
                  src="/services/birthday_kids.png" 
                  alt="Kids Birthday Parties" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-center">
                  <h3 className="font-playfair text-sm md:text-base text-white">Kids Parties</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white group"
              >
                <Image 
                  src="/services/birthday_decorations.png" 
                  alt="Birthday Decorations" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-center">
                  <h3 className="font-playfair text-sm md:text-base text-white">Decorations</h3>
                </div>
              </motion.div>
            </div>

            {/* TIER 3: The Base (Grand Foundation) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full max-w-[850px] md:max-w-[1000px] group z-10"
            >
              <div className="relative aspect-[21/8] rounded-3xl md:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="/services/birthday_milestone.png" 
                  alt="Milestone Birthday Party" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-center md:text-left">
                  <h3 className="font-playfair text-3xl md:text-5xl text-white font-bold uppercase tracking-tight">Milestone <span className="text-[#F1A805]">Bash</span></h3>
                  <p className="text-[#F2D6A1] font-cinzel text-[10px] tracking-[0.4em] mt-2">30th · 40th · 50th · 60th</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Floating Elements ── */
function FloatingBalloon({ color, size, top, left, right, delay }: any) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [-15, 15, -15],
        opacity: [0.2, 0.4, 0.2],
        rotate: [-3, 3, -3]
      }}
      transition={{ 
        duration: 7, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut" 
      }}
      className="absolute"
      style={{ top, left, right }}
    >
      <div 
        className="rounded-full shadow-lg"
        style={{ 
          width: size, 
          height: size * 1.2, 
          backgroundColor: color,
          filter: "blur(3px)"
        }}
      />
      <div className="w-[1px] h-12 mx-auto opacity-10" style={{ backgroundColor: color }} />
    </motion.div>
  );
}

function Confetti() {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = Math.random() * 5 + 2;
  const color = ["#F1A805", "#b87a6c", "#92ADA4", "#F2D6A1"][Math.floor(Math.random() * 4)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        y: [y, y + 15],
        rotate: [0, 360]
      }}
      transition={{ 
        duration: Math.random() * 4 + 4, 
        repeat: Infinity, 
        delay: Math.random() * 5 
      }}
      className="absolute rounded-sm"
      style={{ 
        top: `${y}%`, 
        left: `${x}%`, 
        width: size, 
        height: size, 
        backgroundColor: color,
      }}
    />
  );
}
