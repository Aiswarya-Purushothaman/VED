"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PromotionBanner() {
  return (
    <section className="relative py-12 md:py-16 px-4 md:px-6 overflow-hidden bg-white">
      <div className="container-max relative">
        
        
        <div className="relative group">
          
          <div className="absolute -top-4 left-0 right-0 h-8 z-20 pointer-events-none fill-white">
            <svg viewBox="0 0 1440 48" className="w-full h-full">
              <path d="M0,48 C120,48 120,0 240,0 C360,0 360,48 480,48 C600,48 600,0 720,0 C840,0 840,48 960,48 C1080,48 1080,0 1200,0 C1320,0 1320,48 1440,48 L1440,48 L0,48 Z" />
            </svg>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full aspect-[21/9] md:aspect-[25/8] overflow-hidden shadow-[0_20px_60px_-15px_rgba(132,87,47,0.15)]"
          >
            {/* Main Image */}
            <Image 
              src="/luxury_gift_banner.png" 
              alt="Luxury Personalised Gifts"
              fill
              className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
            />

            {/* Content Overlay - Full Integrated Layout */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/10 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-8">
              
              {/* Branding & Subtitle Integrated */}
              <div className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-center md:text-left">
                <span className="font-cinzel text-xs md:text-sm tracking-[0.6em] uppercase mb-4 block opacity-80">
                  Exclusive Collection
                </span>
                <h2 className="font-playfair text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  New Range of <br/>
                  <em className="font-cormorant italic text-[#F2D6A1]">Personalised</em> Gifts
                </h2>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <span className="w-12 h-px bg-[#F2D6A1]" />
                  <span className="font-cinzel text-[10px] md:text-xs tracking-[0.4em] uppercase">#CelebrateUnique</span>
                </div>
              </div>

              {/* Minimalist Floating Glass CTA Card */}
              <div className="mt-8 md:mt-0 bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-10 rounded-[3rem] shadow-2xl max-w-xs md:max-w-sm text-center md:text-left transform transition-transform duration-700 group-hover:translate-y-[-5px]">
                <p className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-[#F2D6A1] mb-3">Featured items</p>
                <h3 className="font-playfair text-lg md:text-2xl font-bold text-white mb-6 leading-snug">
                  Balloons · Frames · Hampers
                </h3>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 px-10 py-3.5 bg-[#F2D6A1] text-[#84572F] font-cinzel text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-white transition-all duration-300 shadow-xl font-bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11 21 3 13 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                  </svg>
                  Call Us Now
                </a>
              </div>

            </div>
          </motion.div>

          {/* Bottom Scalloped Edge */}
          <div className="absolute -bottom-4 left-0 right-0 h-8 z-20 pointer-events-none fill-white rotate-180">
            <svg viewBox="0 0 1440 48" className="w-full h-full">
              <path d="M0,48 C120,48 120,0 240,0 C360,0 360,48 480,48 C600,48 600,0 720,0 C840,0 840,48 960,48 C1080,48 1080,0 1200,0 C1320,0 1320,48 1440,48 L1440,48 L0,48 Z" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
