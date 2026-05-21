import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decoration Gallery | Virtual Events and Decorations Bengaluru",
  description:
    "Browse our portfolio of stunning decoration setups — birthdays, weddings, anniversaries, baby showers, candlelight dinners & more. Get inspired for your next event.",
  keywords: [
    "decoration gallery Bengaluru",
    "event decoration photos",
    "birthday decoration ideas",
    "wedding decoration portfolio",
    "balloon decoration gallery",
  ],
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Decoration Gallery | Virtual Events and Decorations",
    description: "Browse beautiful decoration setups for every occasion. Get inspired and book your perfect event décor today.",
    type: "website",
    url: "https://virtualeventsanddecorations.in/gallery",
    images: [{ url: "/featured-banner.jpg", width: 1200, height: 630, alt: "Event Decoration Gallery – Virtual Events and Decorations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Decoration Gallery | Virtual Events and Decorations",
    description: "Browse stunning decoration setups for every occasion in Bengaluru.",
    images: ["/featured-banner.jpg"],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
