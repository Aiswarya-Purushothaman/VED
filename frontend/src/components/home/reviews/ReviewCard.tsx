import { Quote } from "lucide-react";
import { SADDLE } from "@/lib/theme";
import StarRow from "./StarRow";
import type { reviews } from "@/data/reviews";

function Avatar({ name, accent }: { name: string; accent: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center font-playfair font-bold text-sm flex-shrink-0"
      style={{ background: `${accent}20`, border: `1.5px solid ${accent}50`, color: accent }}
    >
      {name[0]}
    </div>
  );
}

interface Props {
  review: (typeof reviews)[0];
  accent: string;
  featured?: boolean;
}

export default function ReviewCard({ review, accent, featured = false }: Props) {
  return (
    <div
      className="relative flex flex-col h-full rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(237,250,250,0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${accent}${featured ? "45" : "28"}`,
        boxShadow: featured
          ? `0 8px 40px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.8)`
          : `0 2px 16px ${accent}10, inset 0 1px 0 rgba(255,255,255,0.7)`,
        transform: featured ? "scale(1.02)" : "scale(1)",
      }}
    >
      <Quote className="absolute top-4 right-4 opacity-[0.07] pointer-events-none" size={52} style={{ color: accent }} />

      <div className="flex items-center justify-between mb-4">
        <StarRow rating={review.rating} accent={accent} />
        <span
          className="font-cinzel text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded-full"
          style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
        >
          Google
        </span>
      </div>

      <p className="font-dm text-sm leading-relaxed flex-1 mb-5 line-clamp-4 relative z-10" style={{ color: `${SADDLE}CC` }}>
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-auto">
        <Avatar name={review.name} accent={accent} />
        <div className="min-w-0">
          <p className="font-dm font-semibold text-sm truncate" style={{ color: "#0A1F1E" }}>{review.name}</p>
          <p className="font-cinzel text-[9px] tracking-[0.2em] uppercase opacity-50" style={{ color: SADDLE }}>
            {review.date}
          </p>
        </div>
      </div>

      {featured && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl"
          style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        />
      )}
    </div>
  );
}
