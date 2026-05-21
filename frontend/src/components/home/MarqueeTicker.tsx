"use client";
import { useState } from "react";
import {
  Cake,
  Heart,
  Flower2,
  Baby,
  Building2,
  Flame,
  Monitor,
  PartyPopper,
  Crown,
  Diamond,
  Star,
  Sparkles,
  Gem,
  Trees,
} from "lucide-react";

/* ── Palette ────────────────────────────────────────── */
const SADDLE  = "#84572F";
const TUSCAN  = "#F1A805";
const BUTTER  = "#F2D6A1";
const BREEZE  = "#92ADA4";

/* ── Items with Lucide icons ────────────────────────── */
const items = [
  { label: "Birthday Decorations",   Icon: Cake,         accent: TUSCAN  },
  { label: "Wedding Decorations",    Icon: Flower2,      accent: BUTTER  },
  { label: "Anniversary Setups",     Icon: Heart,        accent: TUSCAN  },
  { label: "Baby Showers",           Icon: Baby,         accent: BREEZE  },
  { label: "Corporate Events",       Icon: Building2,    accent: BUTTER  },
  { label: "Candlelight Dinners",    Icon: Flame,        accent: TUSCAN  },
  { label: "Virtual Events",         Icon: Monitor,      accent: BREEZE  },
  { label: "Festival Decorations",   Icon: PartyPopper,  accent: TUSCAN  },
  { label: "Bachelorette Party",     Icon: Crown,        accent: BUTTER  },
  { label: "Engagement Ceremony",    Icon: Diamond,      accent: TUSCAN  },
  { label: "Kids Birthday Parties",  Icon: Star,         accent: BREEZE  },
  { label: "Premium Luxury Decor",   Icon: Sparkles,     accent: TUSCAN  },
  { label: "Proposal Setups",        Icon: Gem,          accent: BUTTER  },
  { label: "Outdoor Party Setup",    Icon: Trees,        accent: BREEZE  },
];

/* ── Separator between items ──────────────────────── */
function Separator() {
  return (
    <span className="flex items-center mx-8 opacity-30">
      <span
        className="inline-block w-1 h-1 rounded-full"
        style={{ background: TUSCAN }}
      />
      <span
        className="inline-block w-4 h-px mx-1.5"
        style={{ background: `linear-gradient(90deg, ${TUSCAN}, ${BREEZE})` }}
      />
      <span
        className="inline-block w-1 h-1 rounded-full"
        style={{ background: BREEZE }}
      />
    </span>
  );
}

/* ── Main Component ───────────────────────────────── */
export default function MarqueeTicker() {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-4 select-none"
      style={{
        background: `linear-gradient(90deg, ${SADDLE}18 0%, ${SADDLE}10 30%, ${SADDLE}18 100%)`,
        borderTop:    `1px solid ${TUSCAN}22`,
        borderBottom: `1px solid ${TUSCAN}22`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Left / right edge fade masks ── */}
      <div
        className="absolute inset-y-0 left-0 w-28 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #EDFAFA 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-28 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, #EDFAFA 0%, transparent 100%)",
        }}
      />

      {/* ── Scrolling track ── */}
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          animation: "marquee 45s linear infinite",
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {doubled.map(({ label, Icon, accent }, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 flex-shrink-0 group cursor-default"
          >
            {/* Icon bubble */}
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `${accent}20`,
                border: `1px solid ${accent}40`,
              }}
            >
              <Icon
                size={13}
                strokeWidth={1.8}
                style={{ color: accent }}
              />
            </span>

            {/* Label */}
            <span
              className="font-cinzel text-[11px] tracking-[0.28em] uppercase font-medium transition-colors duration-300"
              style={{ color: paused ? accent : SADDLE }}
            >
              {label}
            </span>

            <Separator />
          </span>
        ))}
      </div>
    </div>
  );
}
