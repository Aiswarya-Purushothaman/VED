"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Gem } from "lucide-react";

/* ── Palette ── */
const SADDLE = "#84572F";
const TUSCAN = "#F1A805";

export default function ProposalShowcase() {
  return (
    <section className="relative min-h-screen flex items-center py-24 overflow-hidden bg-[#fcf6ef]">
      {/* ── Background Romantic Aesthetics ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-full"
          style={{ background: "radial-gradient(circle at center, #F1A80508 0%, transparent 70%)" }}
        />
        
        {/* Twinkling "Proposal" Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-1 h-1 bg-[#F1A805] rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              filter: "blur(1px)"
            }}
          />
        ))}
      </div>

      <div className="container-max relative z-10 px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* ── LEFT SIDE: THE DREAM ── */}
          <div className="order-2 lg:order-1 relative">
            <div className="relative z-10 flex flex-col items-center lg:items-start gap-8">
              
              {/* Main Diamond Frame */}
              <motion.div
                initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full aspect-[4/5] md:aspect-square max-w-[500px] group"
              >
                {/* Faceted Border Effect */}
                <div className="absolute -inset-4 border border-[#F1A80520] rotate-45 pointer-events-none" />
                <div className="absolute -inset-8 border border-[#F1A80510] -rotate-12 pointer-events-none" />
                
                <div className="relative w-full h-full overflow-hidden border-8 border-white shadow-2xl clip-diamond">
                  <Image 
                    src="/services/proposal_grand.png" 
                    alt="Grand Surprise Proposal" 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Floating Detail Miniature */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -right-10 md:-right-16 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-xl overflow-hidden z-20"
                >
                  <Image src="/services/service_candlelight.png" alt="Candlelight Detail" fill className="object-cover" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT SIDE: THE STORY ── */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Gem size={18} className="text-[#F1A805]" />
                <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[#84572F]">
                  Surprise & Romance
                </span>
              </div>
              
              <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ color: SADDLE }}>
                The <em className="font-cormorant italic text-[#b87a6c]">Proposal</em> <br /> of Her Dreams
              </h2>
              
              <div className="space-y-6 mb-10">
                <p className="font-dm text-lg text-[#84572F] opacity-70 max-w-md mx-auto lg:mx-0">
                  We turn your "Yes" into an unforgettable masterpiece. From private terrace setups to grand beachside reveals.
                </p>
                
                <div className="flex flex-col gap-4 text-sm font-cinzel tracking-widest text-[#84572F]">
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="w-8 h-px bg-[#F1A805]" />
                    <span>Secret Venue Scouting</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="w-8 h-px bg-[#F1A805]" />
                    <span>Lush Floral Artistry</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="w-8 h-px bg-[#F1A805]" />
                    <span>Cinematic Surprise Reveals</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link
                  href="/services?category=proposal"
                  className="px-10 py-4 bg-[#F1A805] text-black font-cinzel text-[11px] tracking-[0.3em] uppercase hover:bg-[#84572F] hover:text-white transition-all duration-300"
                >
                  Start Planning
                </Link>
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-[#b87a6c]" />
                  <span className="font-cinzel text-[10px] tracking-widest text-[#84572F]">500+ Proposals Inspired</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ── LOWER SECTION: PROPOSAL PACKAGES ── */}
        <div className="mt-20 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4"
          >
            <h3 className="font-playfair text-2xl md:text-3xl font-semibold" style={{ color: SADDLE }}>
              Explore <em className="font-cormorant italic">Proposal</em> Styles
            </h3>
            <div className="flex gap-2">
              <span className="w-12 h-px bg-[#F1A805] self-center" />
              <p className="font-cinzel text-[10px] tracking-widest opacity-60">Signature Experiences</p>
            </div>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-6 px-6">
            {PROPOSAL_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-64 md:w-80 group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 border border-white shadow-lg">
                  <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="font-cinzel text-[8px] tracking-widest text-[#F1A805] uppercase mb-1">{card.tag}</span>
                    <h4 className="font-playfair text-xl text-white group-hover:text-[#F1A805] transition-colors">{card.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .clip-diamond {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        @media (min-width: 768px) {
           .clip-diamond {
              clip-path: polygon(50% 0%, 95% 50%, 50% 100%, 5% 50%);
           }
        }
      `}</style>
    </section>
  );
}

const PROPOSAL_CARDS = [
  {
    title: "Terrace Candlelight",
    tag: "Private & Romantic",
    image: "/services/service_candlelight.png"
  },
  {
    title: "Beachside Surprise",
    tag: "Ocean Whispers",
    image: "/services/service_proposal.png"
  },
  {
    title: "Hotel Suite Magic",
    tag: "Grand Reveal",
    image: "/services/service_premium.png"
  },
  {
    title: "Private Movie Night",
    tag: "Cinematic",
    image: "/services/service_anniversary.png"
  }
];

