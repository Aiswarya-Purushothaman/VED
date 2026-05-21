import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SADDLE } from "@/lib/theme";

interface Props {
  service: { slug: string; image: string; name: string; shortDesc: string };
  accent: string;
  index: number;
  reduced: boolean;
}

export default function MobileCard({ service, accent, index, reduced }: Props) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/services/${service.slug}`} className="group flex items-stretch gap-4 active:opacity-80">
        <div
          className="relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden"
          style={{ border: `1.5px solid ${accent}30` }}
        >
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-active:scale-105"
            sizes="112px"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}30, transparent)` }} />
        </div>

        <div
          className="flex-1 flex flex-col justify-center py-3 px-5 rounded-2xl"
          style={{
            background: "rgba(237,250,250,0.85)",
            border: `1px solid ${accent}20`,
            boxShadow: `0 2px 12px ${accent}10`,
          }}
        >
          <span className="block w-6 h-0.5 mb-2 rounded-full" style={{ background: accent }} />
          <h3 className="font-cormorant text-base font-semibold leading-snug mb-1" style={{ color: "#0A1F1E" }}>
            {service.name}
          </h3>
          <p className="font-dm text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: `${SADDLE}90` }}>
            {service.shortDesc}
          </p>
          <span className="inline-flex items-center gap-1 font-cinzel text-[9px] tracking-[0.25em] uppercase" style={{ color: accent }}>
            Explore <ArrowUpRight size={10} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
