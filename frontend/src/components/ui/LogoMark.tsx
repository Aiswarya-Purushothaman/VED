import React from "react";

const TUSCAN = "#F1A805";
const BUTTER = "#F2D6A1";

export default function LogoMark({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Virtual Events and Decorations logo"
    >
      {/* Outer glow ring */}
      <circle cx="36" cy="36" r="33" stroke={TUSCAN} strokeWidth="0.75" strokeOpacity="0.3" fill="none" />

      {/* Dashed accent ring */}
      <circle cx="36" cy="36" r="26" stroke={BUTTER} strokeWidth="0.5" strokeOpacity="0.25" fill="none" strokeDasharray="4 3" />

      {/* Outer diamond */}
      <path d="M36 8 L56 36 L36 64 L16 36 Z" stroke={TUSCAN} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Inner diamond */}
      <path d="M36 20 L46 36 L36 52 L26 36 Z" stroke={BUTTER} strokeWidth="0.8" fill={`${TUSCAN}12`} strokeLinecap="round" strokeLinejoin="round" />

      {/* Crosshair lines */}
      <line x1="36" y1="8"  x2="36" y2="64" stroke={TUSCAN} strokeWidth="0.4" strokeOpacity="0.2" />
      <line x1="8"  y1="36" x2="64" y2="36" stroke={TUSCAN} strokeWidth="0.4" strokeOpacity="0.2" />

      {/* Centre dot */}
      <circle cx="36" cy="36" r="2.5" fill={TUSCAN} />
    </svg>
  );
}
