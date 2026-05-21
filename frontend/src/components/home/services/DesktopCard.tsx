import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface Props {
  service: { slug: string; image: string; name: string; shortDesc: string };
  accent: string;
  index: number;
}

export default function DesktopCard({ service, accent, index }: Props) {
  return (
    <Link href={`/services/${service.slug}`} className="group block">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "3 / 4", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
      >
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />

        {/* Permanent dark base gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(2,6,8,0.85) 0%, rgba(2,6,8,0.30) 45%, transparent 75%)" }}
        />

        {/* Accent overlay — slides up on hover */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-[60%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
          style={{ background: `linear-gradient(to top, ${accent}DD 0%, ${accent}99 40%, transparent 100%)`, height: "65%" }}
        />

        {/* Left accent thread */}
        <div
          className="absolute left-0 top-8 bottom-8 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${accent}, transparent)` }}
        />

        {/* Index number */}
        <span className="absolute top-3 right-4 font-cinzel text-[9px] tracking-[0.3em] opacity-60 select-none" style={{ color: "#FFFFFF" }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <h3
            className="font-cormorant font-semibold leading-tight mb-0"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)", color: "#FFFFFF" }}
          >
            {service.name}
          </h3>
          <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-all duration-500 ease-out">
            <p className="font-dm text-xs leading-relaxed mt-2 mb-3 line-clamp-2" style={{ color: "rgba(255,255,255,0.80)" }}>
              {service.shortDesc}
            </p>
            <span className="inline-flex items-center gap-1.5 font-cinzel text-[9px] tracking-[0.3em] uppercase" style={{ color: "#FFFFFF" }}>
              Explore
              <ArrowUpRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
