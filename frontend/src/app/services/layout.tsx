import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Decoration Services | Virtual Events and Decorations Bengaluru",
  description:
    "Explore 20+ premium decoration services in Bengaluru — birthdays, weddings, anniversaries, baby showers, candlelight dinners, corporate events & more. Call 8884447579.",
  keywords: [
    "decoration services Bengaluru",
    "event decoration",
    "birthday decoration Bengaluru",
    "wedding decoration",
    "anniversary decoration",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "All Decoration Services | Virtual Events and Decorations",
    description: "Premium decoration services for every occasion in Bengaluru. Balloon arches, floral mandaps, candlelight setups & more.",
    type: "website",
    url: "https://virtualeventsanddecorations.in/services",
    images: [{ url: "/hero-wedding-mandap.jpg", width: 1200, height: 630, alt: "Decoration Services in Bengaluru" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Decoration Services | Virtual Events and Decorations",
    description: "Premium decoration services for every occasion in Bengaluru.",
    images: ["/hero-wedding-mandap.jpg"],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
