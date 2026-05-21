import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00A693",
        "primary-light": "#5ECEC6",
        gold: "#C9A84C",
        "gold-light": "#F0D080",
        accent: "#C9A84C",
        dark: "#EDFAFA",          // main page background (teal white)
        "dark-card": "#E0F5F5",   // card / section background (soft teal)
        "dark-mid": "#C8EEEE",    // alternate section bg (medium teal)
        light: "#0A1F1E",         // primary text (deep teal-black)
        "text-muted": "#4A7C7C",  // muted body text (muted teal)
        "ink": "#0A1F1E",
        "ink-muted": "#4A7C7C",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse2: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(37,211,102,0.6)",
          },
          "50%": {
            transform: "scale(1.08)",
            boxShadow: "0 0 0 12px rgba(37,211,102,0)",
          },
        },
        "pulse-gold": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(0,166,147,0.6)",
          },
          "50%": {
            transform: "scale(1.08)",
            boxShadow: "0 0 0 12px rgba(0,166,147,0)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
