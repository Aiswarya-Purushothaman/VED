"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, ArrowLeft } from "lucide-react";

interface Props {
  name: string;
  image: string;
  whatsappUrl: string;
}

export default function ServiceHeroSection({ name, image, whatsappUrl }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "28%"]);

  return (
    <section ref={ref} className="relative h-[60vh] min-h-[400px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image src={image} alt={name} fill className="object-cover" priority sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-end pb-12 px-4"
      >
        <div className="container-max w-full">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-primary font-dm text-sm mb-4 hover:gap-3 transition-all"
          >
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-5">{name}</h1>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <MessageCircle size={18} /> Enquire on WhatsApp
            </a>
            <a href="tel:8884447579" className="btn-outline">
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
